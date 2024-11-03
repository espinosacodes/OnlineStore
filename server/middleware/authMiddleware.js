const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token required' });

    try {
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin role required' });
    next();
};

