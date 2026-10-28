import { useEffect, useState } from "react";
import { Plus, Users, X } from "lucide-react";
import api, {
    getList,
    getErrorMessage,
} from "../services/api";

const initialForm = {
    name: "",
    email: "",
    password: "",
    department: "",
};

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function loadEmployees() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/employees");

            setEmployees(
                getList(response, ["employees", "users"])
            );
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEmployees();
    }, []);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        try {
            setSaving(true);

            await api.post("/employees", {
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                department: form.department.trim(),
            });

            setForm(initialForm);
            setShowForm(false);
            setMessage("Employee added successfully.");

            await loadEmployees();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Employees</h1>
                    <p>View and register employees.</p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => {
                        setShowForm(!showForm);
                        setError("");
                        setMessage("");
                    }}
                >
                    {showForm ? <X size={17} /> : <Plus size={17} />}
                    {showForm ? "Close Form" : "Add Employee"}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            {showForm && (
                <section className="content-card form-card">
                    <div className="section-header">
                        <h2>Register New Employee</h2>
                    </div>

                    <form className="form-grid" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="employee@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Temporary Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                minLength={8}
                                placeholder="Minimum 8 characters"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input
                                id="department"
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                placeholder="e.g. IT"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                className="primary-button"
                                type="submit"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Create Employee"}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="content-card">
                <div className="section-header">
                    <div>
                        <h2>Employee Directory</h2>
                        <p>{employees.length} employee records</p>
                    </div>

                    <Users size={22} color="#2563eb" />
                </div>

                {loading ? (
                    <div className="loading-state">Loading employees...</div>
                ) : employees.length === 0 ? (
                    <div className="empty-state">No employees found.</div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>DEPARTMENT</th>
                                <th>ROLE</th>
                            </tr>
                            </thead>

                            <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>
                                        <div className="employee-table-name">
                                            <div className="avatar">
                                                {employee.name?.charAt(0)?.toUpperCase() || "U"}
                                            </div>
                                            <strong>{employee.name}</strong>
                                        </div>
                                    </td>

                                    <td>{employee.email}</td>
                                    <td>{employee.department || "-"}</td>
                                    <td>
                      <span className="role-badge">
                        {employee.role || "EMPLOYEE"}
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

export default Employees;