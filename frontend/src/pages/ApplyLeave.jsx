import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";

import api, { getErrorMessage } from "../services/api";

function ApplyLeave() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        leave_type: "ANNUAL",
        start_date: "",
        end_date: "",
        reason: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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

        if (form.end_date < form.start_date) {
            setError("End date cannot be before the start date.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/leaves", {
                leave_type: form.leave_type,
                start_date: form.start_date,
                end_date: form.end_date,
                reason: form.reason.trim(),
            });

            setMessage("Leave application submitted successfully.");

            setTimeout(() => {
                navigate("/employee/my-leaves");
            }, 1000);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Apply for Leave</h1>
                    <p>Submit a new leave application for approval.</p>
                </div>

                <CalendarDays size={28} color="#2563eb" />
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <section className="content-card form-card">
                <div className="section-header">
                    <div>
                        <h2>Leave Application Form</h2>
                        <p>Fill in the required details below.</p>
                    </div>
                </div>

                <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="leave_type">Leave Type</label>

                        <select
                            id="leave_type"
                            name="leave_type"
                            value={form.leave_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="ANNUAL">Annual Leave</option>
                            <option value="CASUAL">Casual Leave</option>
                            <option value="MEDICAL">Medical Leave</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="start_date">Start Date</label>

                        <input
                            id="start_date"
                            name="start_date"
                            type="date"
                            value={form.start_date}
                            min={new Date().toLocaleDateString("en-CA")}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="end_date">End Date</label>

                        <input
                            id="end_date"
                            name="end_date"
                            type="date"
                            value={form.end_date}
                            min={
                                form.start_date ||
                                new Date().toLocaleDateString("en-CA")
                            }
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="reason">Reason for Leave</label>

                        <textarea
                            id="reason"
                            name="reason"
                            rows="5"
                            value={form.reason}
                            onChange={handleChange}
                            placeholder="Explain why you need leave..."
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => navigate("/employee")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Application"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default ApplyLeave;