const db = require("../config/db");

// Get all employees
exports.getEmployees = async (req, res) => {
    try {
        const [employees] = await db.execute(
            `SELECT id, name, email, department, role, created_at
             FROM employees
             ORDER BY id DESC`
        );

        return res.status(200).json({
            success: true,
            count: employees.length,
            employees
        });
    } catch (error) {
        console.error("Get employees error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve employees"
        });
    }
};

// Create employee (Admin only)
exports.createEmployee = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        if (!name || !email || !password || !department) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and department are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        const [existing] = await db.execute(
            "SELECT id FROM employees WHERE email = ?",
            [normalizedEmail]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            `INSERT INTO employees
                (name, email, password, department, role)
             VALUES (?, ?, ?, ?, 'EMPLOYEE')`,
            [
                name.trim(),
                normalizedEmail,
                hashedPassword,
                department.trim()
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            employee: {
                id: result.insertId,
                name: name.trim(),
                email: normalizedEmail,
                department: department.trim(),
                role: "EMPLOYEE"
            }
        });
    } catch (error) {
        console.error("Create employee error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create employee"
        });
    }
};