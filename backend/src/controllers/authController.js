const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
}

// Employee Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        // Validate required fields
        if (!name || !email || !password || !department) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
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

        // Check whether email already exists
        const [existingUsers] = await db.execute(
            "SELECT id FROM employees WHERE email = ?",
            [normalizedEmail]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Public signup always creates an EMPLOYEE
        // Never accept role from the public request body
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

        // Create user object
        const user = {
            id: result.insertId,
            name: name.trim(),
            email: normalizedEmail,
            department: department.trim(),
            role: "EMPLOYEE"
        };

        // Generate JWT
        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "Employee registered successfully",
            token,
            user
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to register employee"
        });
    }
};


// Employee/Admin Login
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find employee by email
        const [rows] = await db.execute(
            "SELECT * FROM employees WHERE email = ?",
            [normalizedEmail]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const employee = rows[0];

        // Compare password
        const passwordMatches = await bcrypt.compare(
            password,
            employee.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Get user details from database
        const user = {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            department: employee.department,
            role: employee.role
        };

        // Generate token using the database role
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        console.error("Signin error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to login"
        });
    }
};


// Get Current Logged-in User
exports.getMe = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT id, name, email, department, role, created_at
             FROM employees
             WHERE id = ?`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: rows[0]
        });

    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get user details"
        });
    }
};