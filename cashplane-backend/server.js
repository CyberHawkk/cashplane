// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const webhookRoutes = require("./routes/webhook");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf } })); // needed for Paystack webhook
app.use(express.urlencoded({ extended: false }));

// ✅ Routes
app.use("/api/auth", authRoutes);      // Auth routes
app.use("/api/webhook", webhookRoutes); // Webhook endpoint

// ✅ Health check / Test
app.get("/", (req, res) => {
  res.send("✅ CashPlane Backend is running!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
