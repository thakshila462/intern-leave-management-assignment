
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./src/config/db");

const authRoutes = require("./src/routes/authRouter");
const employeeRoutes = require("./src/routes/employeeRoutes");
const leaveRoutes = require("./src/routes/leaveRouter");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Employee Leave Management API is running!",
        url: "http://localhost:5000"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// Start server after checking database connection
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from .env file");
        }

        await db.query("SELECT 1");

        console.log("MySQL database connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
}
}

startServer();
