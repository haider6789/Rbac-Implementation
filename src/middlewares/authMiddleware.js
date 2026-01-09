const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    console.log(token, process.env.JWT_SECRET)
try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded:", decoded); // See if decoding works
        req.user = decoded;
        next();
    } catch (error) {
        // ADD THIS LINE to see the real error in your terminal
        console.log("JWT Verification Error:", error.message); 
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;

