require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const webhookRoutes = require("./routes/webhook");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Global Middleware for all routes except webhook
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Webhook route uses raw body parsing for Paystack signature verification
app.use(
  "/api/webhook",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
  webhookRoutes
);

// ✅ Auth routes normal JSON parsing
app.use("/api/auth", authRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ CashPlane Backend is running!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
