const express = require('express');
require('dotenv').config();
const pool = require('./src/config/dbConnection');
const app = express();
const authRoutes = require('./src/routes/authRoutes');
const authMiddleware = require('./src/middlewares/authMiddleware');

// Test DB connection
pool.query('SELECT NOW()').then(() => {
    console.log('Database connected successfully');
}).catch(err => {
    console.error('Database connection failed:', err);
});

//read JSON data sent in req body aka translator
app.use(express.json());


app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/roleRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
// A simple test route
app.get('/', (req, res) => {
    res.send('RBAC System is Running!');
});

app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello ${req.user.username}, you have accessed a protected route!` });
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is moving on http://localhost:${PORT}`);
});