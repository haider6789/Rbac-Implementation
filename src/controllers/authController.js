const bcrypt = require('bcrypt'); // Fixed typo: 'bycrypt' -> 'bcrypt'
const jwt = require('jsonwebtoken');
const pool = require('../models/userModel');

const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lookup role_id
        const roleRes = await pool.query('SELECT id FROM roles WHERE name = $1', [role || 'user']); // Default to 'user'
        if (roleRes.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        const roleId = roleRes.rows[0].id;

        await pool.query(
            'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3)',
            [username, hashedPassword, roleId]
        );

        res.status(201).json({ message: `User registered successfully ${username}` });

    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { username: user.username, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = { register, login };