import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import api, {
    getList,
    getErrorMessage,
} from "../services/api";

function MyLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadMyLeaves() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/leaves/my");

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
        loadMyLeaves();
    }, []);

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>My Leave Applications</h1>
                    <p>Track the status of your leave requests.</p>
                </div>

                <button
                    className="secondary-button"
                    onClick={loadMyLeaves}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <section className="content-card">
                <div className="section-header">
                    <div>
                        <h2>Leave History</h2>
                        <p>{leaves.length} applications found</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        Loading your applications...
                    </div>
                ) : leaves.length === 0 ? (
                    <div className="empty-state">
                        You have not submitted any leave applications.
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>LEAVE TYPE</th>
                                <th>START DATE</th>
                                <th>END DATE</th>
                                <th>REASON</th>
                                <th>STATUS</th>
                                <th>REJECTION REASON</th>
                            </tr>
                            </thead>

                            <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave.id}>
                                    <td>{leave.leave_type}</td>
                                    <td>{leave.start_date?.slice(0, 10)}</td>
                                    <td>{leave.end_date?.slice(0, 10)}</td>
                                    <td>{leave.reason}</td>

                                    <td>
                      <span
                          className={`status-badge ${leave.status?.toLowerCase()}`}
                      >
                        {leave.status}
                      </span>
                                    </td>

                                    <td>{leave.rejection_reason || "-"}</td>
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

export default MyLeaves;