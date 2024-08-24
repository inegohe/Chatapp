const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authentication");
const profileController = require("../controllers/profileController");

// Get user profile
router.get("/", authenticateToken, profileController.getUserProfile);

// Update user avatar
router.post("/avatar", authenticateToken, profileController.updateAvatar);

// Update user profile information
router.put("/", authenticateToken, profileController.updateProfile);

module.exports = router;
