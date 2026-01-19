const pool = require('../models/userModel');

const checkPermission = (permission) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.role_id) {
            return res.status(401).json({ error: 'User not authenticated or missing role' });
        }

        const roleId = req.user.role_id;

        try {
            // Check if role has permission
            const query = `
                SELECT 1 
                FROM role_permissions rp
                JOIN permissions p ON rp.permission_id = p.id
                WHERE rp.role_id = $1 AND p.name = $2
            `;
            const result = await pool.query(query, [roleId, permission]);

            if (result.rows.length > 0) {
                return next();
            }

            return res.status(403).json({ error: `Access denied. Required permission: ${permission}` });

        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
};

module.exports = checkPermission;
