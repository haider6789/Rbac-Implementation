const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const { updateUserRole, getAllUsers, getUserDetails, deleteUser } = require('../controllers/roleController');

router.put(
    '/',
    authMiddleware,
    checkPermission('manage_users'),
    updateUserRole
);

router.get(
    '/',
    authMiddleware,
    checkPermission('manage_users'),
    getAllUsers
);

router.get(
    '/:username',
    authMiddleware,
    checkPermission('manage_users'), // Assuming managing users implies viewing details
    getUserDetails
);

router.delete(
    '/:id',
    authMiddleware,
    checkPermission('delete_user'), // Scalable Route Definition as requested
    deleteUser
);

module.exports = router;
