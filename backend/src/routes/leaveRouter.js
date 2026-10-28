const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus
} = require("../controllers/leaveController");

router.use(authenticateToken);

// Employee: Submit a leave request
router.post(
    "/",
    authorizeRoles("EMPLOYEE"),
    applyLeave
);

// Employee: View own leave requests
router.get(
    "/my",
    authorizeRoles("EMPLOYEE"),
    getMyLeaves
);

// Admin: View all leave requests
router.get(
    "/",
    authorizeRoles("ADMIN"),
    getAllLeaves
);

// Admin: Approve or reject a pending leave request
router.patch(
    "/:id/status",
    authorizeRoles("ADMIN"),
    updateLeaveStatus
);

module.exports = router;