const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getEmployees,
    createEmployee
} = require("../controllers/employeeController");

router.use(authenticateToken);

router.get(
    "/",
    authorizeRoles("ADMIN"),
    getEmployees
);

router.post(
    "/",
    authorizeRoles("ADMIN"),
    createEmployee
);

module.exports = router;