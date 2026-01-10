const express = require('express');
const {pool} = require('pg');
const dotenv = require('dotenv').config();
const dbConnection = require('./src/config/dbConnection');
const userModel = require('./src/models/userModel');    
const app = express();
const authRoutes = require('./src/routes/authRoutes');
const authMiddleware = require('./src/middlewares/authMiddleware');
//const PORT = 3000;


dbConnection();
// This allows your app to read JSON data sent in request bodies
app.use(express.json());

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/roles', require('./src/routes/roleRoutes'));
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