import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import api, {
    getList,
    getErrorMessage,
} from "../services/api";

function EmployeeDashboard() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadMyLeaves() {
            try {
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

        loadMyLeaves();
    }, []);

    const stats = [
        {
            title: "Total Applications",
            value: leaves.length,
            icon: CalendarDays,
            color: "blue",
        },
        {
            title: "Pending",
            value: leaves.filter((leave) => leave.status === "PENDING").length,
            icon: Clock,
            color: "orange",
        },
        {
            title: "Approved",
            value: leaves.filter((leave) => leave.status === "APPROVED").length,
            icon: CheckCircle,
            color: "green",
        },
        {
            title: "Rejected",
            value: leaves.filter((leave) => leave.status === "REJECTED").length,
            icon: XCircle,
            color: "red",
        },
    ];

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>My Dashboard</h1>
                    <p>View your leave applications and their current status.</p>
                </div>

                <Link to="/employee/apply-leave" className="primary-button">
                    + Apply for Leave
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="stats-grid">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div className="stat-card" key={stat.title}>
                            <div className="stat-info">
                                <p>{stat.title}</p>
                                <h2>{stat.value}</h2>
                            </div>

                            <div className={`stat-icon ${stat.color}`}>
                                <Icon size={22} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <section className="content-card">
                <div className="section-header">
                    <div>
                        <h2>Recent Applications</h2>
                        <p>Your latest leave requests.</p>
                    </div>

                    <Link to="/employee/my-leaves" className="text-link">
                        View All →
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-state">Loading your leaves...</div>
                ) : leaves.length === 0 ? (
                    <div className="empty-state">
                        You have not applied for any leave yet.
                        <div>
                            <Link
                                to="/employee/apply-leave"
                                className="text-link"
                            >
                                Apply for your first leave
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>LEAVE TYPE</th>
                                <th>START DATE</th>
                                <th>END DATE</th>
                                <th>STATUS</th>
                            </tr>
                            </thead>

                            <tbody>
                            {leaves.slice(0, 5).map((leave) => (
                                <tr key={leave.id}>
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

export default EmployeeDashboard;