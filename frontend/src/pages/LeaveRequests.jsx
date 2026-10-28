import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import api, {
    getList,
    getErrorMessage,
} from "../services/api";

function LeaveRequests() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [processingId, setProcessingId] = useState(null);

    async function loadLeaves() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/leaves");

            setLeaves(
                getList(response, ["leaves", "requests"])
            );
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadLeaves();
    }, []);

    async function updateStatus(leave, status) {
        let rejectionReason = "";

        if (status === "REJECTED") {
            rejectionReason = window.prompt(
                "Enter a reason for rejecting this leave:"
            );

            if (rejectionReason === null) {
                return;
            }

            rejectionReason = rejectionReason.trim();

            if (!rejectionReason) {
                setError("A rejection reason is required.");
                return;
            }
        }

        try {
            setProcessingId(leave.id);
            setError("");
            setMessage("");

            await api.patch(`/leaves/${leave.id}/status`, {
                status,
                ...(status === "REJECTED"
                    ? { rejection_reason: rejectionReason }
                    : {}),
            });

            setMessage(`Leave request ${status.toLowerCase()} successfully.`);

            await loadLeaves();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setProcessingId(null);
        }
    }

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Leave Requests</h1>
                    <p>Review and manage employee leave applications.</p>
                </div>

                <button className="secondary-button" onClick={loadLeaves}>
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <section className="content-card">
                <div className="section-header">
                    <div>
                        <h2>All Applications</h2>
                        <p>{leaves.length} leave requests</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Loading leave requests...</div>
                ) : leaves.length === 0 ? (
                    <div className="empty-state">No leave requests found.</div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>EMPLOYEE ID</th>
                                <th>LEAVE TYPE</th>
                                <th>START DATE</th>
                                <th>END DATE</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                            </thead>

                            <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave.id}>
                                    <td>{leave.employee_id ?? "-"}</td>
                                    <td>{leave.leave_type}</td>
                                    <td>{leave.start_date?.slice(0, 10)}</td>
                                    <td>{leave.end_date?.slice(0, 10)}</td>

                                    <td>
                      <span
                          className={`status-badge ${leave.status?.toLowerCase()}`}
                      >
                        {leave.status}
                      </span>
                                    </td>

                                    <td>
                                        {leave.status === "PENDING" ? (
                                            <div className="action-buttons">
                                                <button
                                                    className="approve-button"
                                                    disabled={processingId === leave.id}
                                                    onClick={() =>
                                                        updateStatus(leave, "APPROVED")
                                                    }
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    className="reject-button"
                                                    disabled={processingId === leave.id}
                                                    onClick={() =>
                                                        updateStatus(leave, "REJECTED")
                                                    }
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="muted-text">No action</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default LeaveRequests;