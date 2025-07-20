const express = require("express");
const router = express.Router();

// ✅ Middleware to parse JSON body
router.use(express.json());

// ✅ Registration Route
router.post("/register", (req, res) => {
  const { fullname, email, password } = req.body;

  // Basic validation
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Simulate saving to DB
  console.log("✅ New Registration:", { fullname, email });

  // You could later:
  // - Hash password
  // - Save to database
  // - Send verification email

  return res.status(200).json({
    message: "Registration successful! Please verify your email.",
    user: { fullname, email },
  });
});

// ✅ Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  // Simulate DB check (in real app, check hashed password match)
  console.log("✅ Login Attempt:", { email });

  return res.status(200).json({
    message: "Login successful!",
    user: { email },
  });
});

module.exports = router;
