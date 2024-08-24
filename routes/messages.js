const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const authenticateToken = require("../middleware/authentication");

// Add your message-related routes here
router.post('/send', authenticateToken, async (req, res) => {
    const { user, message } = req.body;
    try {
        const newMessage = new Message({ user, message });
        await newMessage.save();
        res.json(newMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

router.get('/history', authenticateToken, async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
