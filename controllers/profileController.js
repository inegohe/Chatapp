const User = require("../models/User");

/**
 * Getting the user's profile excluding the password.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

/**
 * Updating the user's avatar.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
exports.updateAvatar = async (req, res) => {
    const { avatar } = req.body;
    if (!avatar) {
        return res.status(400).json({ msg: "Avatar is required" });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { avatar },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ message: "Avatar updated successfully", avatar: user.avatar });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

/**
 * Updating the user's profile information.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
exports.updateProfile = async (req, res) => {
    const { name, email } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name, email },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ message: "Profile updated successfully", user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
};
