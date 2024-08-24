const express = require("express");
const router = express.Router();
const { loginUser, signupUser } = require('../controllers/authController');

// Add your authentication routes here
router.post('/login', loginUser);
router.post('/signup', signupUser);

module.exports = router;
