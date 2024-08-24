const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
const Message = require('./models/message');
const redisAdapter = require("socket.io-redis");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware/authentication");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const JWT_SECRET = process.env.JWT_SECRET || 'trwebombekueasloab';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/auth", authRoutes);

app.set('trust proxy', 1);

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Socket.io Setup
io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("chat message", async (data) => {
        try {
            // Save message to the database
            const message = new Message({ user: data.user, message: data.message });
            await message.save();
            io.emit("chat message", data); // Broadcast message to all connected clients
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on("typing", (user) => {
        socket.broadcast.emit("typing", user);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Routes
app.use('/api', authenticateToken);
app.get("/chat", authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, "/public", "chat.html"));
});

app.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

app.post("/profile/avatar", authenticateToken, async (req, res) => {
    const { avatar } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.userId, { avatar });
        res.json({ message: "Avatar updated" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// Database Connection and Server Start
mongoose
    .connect("mongodb+srv://mbabazieken:kashera2023@cluster0.x3cma6f.mongodb.net/daystar", {})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB not connected:", err));

const PORT = process.env.PORT || 8800;
server.listen(PORT, (err) => {
    if (err) {
        console.error("Error starting server:", err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});
