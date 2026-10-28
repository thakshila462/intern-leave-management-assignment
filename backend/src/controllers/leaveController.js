const db = require("../config/db");

const VALID_LEAVE_TYPES = ["ANNUAL", "CASUAL", "MEDICAL"];

// Submit leave request
exports.applyLeave = async (req, res) => {
    try {
        const { leave_type, start_date, end_date, reason } = req.body;

        if (!leave_type || !start_date || !end_date || !reason) {
            return res.status(400).json({
                success: false,
                message: "All leave request fields are required"
            });
        }

        if (!VALID_LEAVE_TYPES.includes(leave_type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid leave type"
            });
        }

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(start_date) ||
            !/^\d{4}-\d{2}-\d{2}$/.test(end_date)
        ) {
            return res.status(400).json({
                success: false,
                message: "Dates must use YYYY-MM-DD format"
            });
        }

        const start = new Date(`${start_date}T00:00:00Z`);
        const end = new Date(`${end_date}T00:00:00Z`);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            start.toISOString().slice(0, 10) !== start_date ||
            end.toISOString().slice(0, 10) !== end_date
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid calendar date"
            });
        }

        if (end < start) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });
        }

        if (!reason.trim()) {
            return res.status(400).json({
                success: false,
                message: "Reason is required"
            });
        }

        // Take employee ID from the verified JWT, not the request body.
        const employeeId = req.user.id;

        const [result] = await db.execute(
            `INSERT INTO leave_requests
                (employee_id, leave_type, start_date, end_date, reason)
             VALUES (?, ?, ?, ?, ?)`,
            [
                employeeId,
                leave_type,
                start_date,
                end_date,
                reason.trim()
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Leave request submitted successfully",
            leaveRequest: {
                id: result.insertId,
                employee_id: employeeId,
                leave_type,
                start_date,
                end_date,
                reason: reason.trim(),
                status: "PENDING"
            }
        });
    } catch (error) {
        console.error("Apply leave error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit leave request"
        });
    }
};

// Get logged-in employee's leave requests
exports.getMyLeaves = async (req, res) => {
    try {
        const [leaves] = await db.execute(
            `SELECT *
             FROM leave_requests
             WHERE employee_id = ?
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            count: leaves.length,
            leaves
        });
    } catch (error) {
        console.error("Get my leaves error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve leave requests"
        });
    }
};

// Admin: Get all leave requests
exports.getAllLeaves = async (req, res) => {
    try {
        const [leaves] = await db.execute(
            `SELECT
                lr.*,
                e.name AS employee_name,
                e.email AS employee_email,
                e.department
             FROM leave_requests lr
             INNER JOIN employees e ON lr.employee_id = e.id
             ORDER BY lr.created_at DESC`
        );

        return res.status(200).json({
            success: true,
            count: leaves.length,
            leaves
        });
    } catch (error) {
        console.error("Get all leaves error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve leave requests"
        });
    }
};

// Admin: Approve or reject a pending request
exports.updateLeaveStatus = async (req, res) => {
    try {
        const leaveId = Number(req.params.id);
        const { status, rejection_reason } = req.body;

        if (!Number.isInteger(leaveId) || leaveId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid leave request ID"
            });
        }

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be APPROVED or REJECTED"
            });
        }

        if (status === "REJECTED" &&
            (!rejection_reason || !rejection_reason.trim())) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }

        const [result] = await db.execute(
            `UPDATE leave_requests
             SET status = ?, rejection_reason = ?
             WHERE id = ? AND status = 'PENDING'`,
            [
                status,
                status === "REJECTED" ? rejection_reason.trim() : null,
                leaveId
            ]
        );

        if (result.affectedRows === 0) {
            const [rows] = await db.execute(
                "SELECT id, status FROM leave_requests WHERE id = ?",
                [leaveId]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Leave request not found"
                });
            }

            return res.status(409).json({
                success: false,
                message: "Only pending requests can be approved or rejected",
                currentStatus: rows[0].status
            });
        }

        return res.status(200).json({
            success: true,
            message: `Leave request ${status.toLowerCase()} successfully`,
            leaveRequest: {
                id: leaveId,
                status,
                rejection_reason:
                    status === "REJECTED" ? rejection_reason.trim() : null
            }
        });
    } catch (error) {
        console.error("Update leave status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update leave request"
        });
    }
};