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
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUseruser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: await bcrypt.hash(password, 12),
        });

        await newUser.save();

        // Create JWT token
        const payload = { userId: user.id };
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
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Create JWT token
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'trwebombekueasloab', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
};
