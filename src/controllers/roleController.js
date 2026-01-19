const pool = require('../models/userModel'); // Database pool

const updateUserRole = async (req, res) => {
    try {
        const { username, newRole } = req.body;

        //validate role input
        const validRoles = ['admin', 'user'];
        if (!validRoles.includes(newRole)) {
            return res.status(400).json({
                error: `Invalid role. Must be one of: ${validRoles.join(', ')}`
            });
        }

        //check if user exists
        const userResult = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        //update user role
        await pool.query(
            'UPDATE users SET role = $1 WHERE username = $2',
            [newRole, username]
        );

        res.json({
            message: `User ${username} role updated to ${newRole} successfully`
        });

    } catch (error) {
        console.error('Role change error:', error);
        res.status(500).json({ error: 'Failed to change user role' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT username, role FROM users');
        res.json({ users: result.rows });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { username } = req.params;
        const result = await pool.query(
            'SELECT username, role FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error('Get user role error:', error);
        res.status(500).json({ error: 'Failed to fetch user role' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

module.exports = { updateUserRole, getAllUsers, getUserDetails, deleteUser };
