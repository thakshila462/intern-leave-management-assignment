import { useEffect, useState } from "react";
import {
    Users,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCw,
} from "lucide-react";

import api, {
    getList,
    getErrorMessage,
} from "../services/api";

function AdminDashboard() {
    const [employees, setEmployees] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const [employeeResponse, leaveResponse] = await Promise.all([
                api.get("/employees"),
                api.get("/leaves"),
            ]);

            setEmployees(
                getList(employeeResponse, ["employees", "users"])
            );

            setLeaves(
                getList(leaveResponse, ["leaves", "requests"])
            );
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    const pending = leaves.filter(
        (leave) => leave.status === "PENDING"
    ).length;

    const approved = leaves.filter(
        (leave) => leave.status === "APPROVED"
    ).length;

    const rejected = leaves.filter(
        (leave) => leave.status === "REJECTED"
    ).length;

    const stats = [
        {
            title: "Total Employees",
            value: employees.length,
            icon: Users,
            color: "blue",
        },
        {
            title: "Pending Requests",
            value: pending,
            icon: Clock,
            color: "orange",
        },
        {
            title: "Approved Leaves",
            value: approved,
            icon: CheckCircle,
            color: "green",
        },
        {
            title: "Rejected Leaves",
            value: rejected,
            icon: XCircle,
            color: "red",
        },
    ];

    if (loading) {
        return <div className="loading-state">Loading dashboard...</div>;
    }

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Overview of employees and leave requests.</p>
                </div>

                <button className="secondary-button" onClick={loadDashboard}>
                    <RefreshCw size={16} />
                    Refresh
                </button>
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
                        <h2>Recent Leave Requests</h2>
                        <p>Latest employee applications.</p>
                    </div>
                </div>

                {leaves.length === 0 ? (
                    <div className="empty-state">
                        No leave requests found.
                    </div>
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
                            </tr>
                            </thead>

                            <tbody>
                            {[...leaves]
                                .sort(
                                    (a, b) =>
                                        new Date(b.created_at || b.createdAt || 0) -
                                        new Date(a.created_at || a.createdAt || 0)
                                )
                                .slice(0, 8)
                                .map((leave) => (
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

export default AdminDashboard;