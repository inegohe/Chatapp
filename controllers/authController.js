const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Register a new user.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: await bcrypt.hash(password, 12),
        });

        await newUser.save();

        // Create JWT token
        const payload = { userId: newUser.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'trwebombekueasloab', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

/**
 * Authenticate user and return JWT token.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
exports.login = async (req, res) => {
    const { email, password } = req.body; 
    console.log("Login request received:", { email, password});

    try {
        const user = await User.findOne({ email });
        console.log("User found:", user);
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        
        console.log("Stored hash:", user.password); console.log("Stored hash:", user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        //  JWT token
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'trwebombekueasloab', { expiresIn: '1h' });
        console.log("JWT token created:", token);


        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
};
