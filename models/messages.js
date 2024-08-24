const mongoose = require('mongoose');

// Define the message schema
const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

// Create the Message model
const Message = mongoose.model('Message', messageSchema);

// Save a message to the database
socket.on('chat message', async (msg) => {
    const message = new Message({ sender: socket.userId, message: msg });
    await message.save();
    io.emit('chat message', msg);
});

// Load previous messages when a user connects
socket.on('load messages', async () => {
    const messages = await Message.find().sort({ timestamp: 1 });
    socket.emit('previous messages', messages);
});

module.exports = mongoose.model('Message', messageSchema);