const Message = require("../models/Message");

/**
 * Handle new chat message and broadcast it to all clients.
 * 
 * @param {Object} data - Data containing user and message information
 * @param {Object} io - Socket.io instance
 * @returns {void}
 */
exports.handleChatMessage = async (data, io) => {
    try {
        // Save message to the database
        const message = new Message({ user: data.user, message: data.message });
        await message.save();

        // Broadcast message to all connected clients
        io.emit("chat message", data);
    } catch (err) {
        console.error(err.message);
        // Handle error (log it, send notification, etc.)
    }
};

/**
 * Handle typing notifications.
 * 
 * @param {Object} user - User information
 * @param {Object} socket - Socket instance
 * @returns {void}
 */
exports.handleTyping = (user, socket) => {
    socket.broadcast.emit("typing", user);
};
