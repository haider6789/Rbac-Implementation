const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { changeUserRole, getAllUsers, getUserRole } = require('../controllers/roleController');

// Admin only route to change any user's role
router.put(
    '/change-role', 
    authMiddleware, 
    roleMiddleware('admin'), 
    changeUserRole
);

// Admin only route to view all users
router.get(
    '/all-users', 
    authMiddleware, 
    roleMiddleware('admin'), 
    getAllUsers
);

// Any authenticated user can view a specific user's role
router.get(
    '/user-role/:username', 
    authMiddleware, 
    getUserRole
);

module.exports = router;
