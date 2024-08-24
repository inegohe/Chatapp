const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || 'trwebombekueasloab';

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ msg: "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach the decoded token to the request object
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(401).json({ msg: "Invalid token" });
    }
}

module.exports = authenticateToken;
