const express = require("express");
const { check, validationResult } = require("express-validator");
const Registration = require("../models/registration");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "trwebombekueasloab";

// Signup Route
router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await Registration.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new Registration({ username, email, password });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = { userId: user.id };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await Registration.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      console.log("Plain password:", password);
      console.log("Hashed password:", user.password);

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Plain password:", password);
      console.log("Hashed password from DB:", user.password);
      if (!isMatch) {
        console.log("Password match:");
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = { userId: user.id };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      res.json({ token });
    } catch (err) {
      console.error("Server error:", err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
