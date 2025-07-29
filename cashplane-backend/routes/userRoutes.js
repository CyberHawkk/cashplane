const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// ✅ Email verification after clicking link
router.post("/verify-email", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email required." });

  const { error } = await supabase
    .from("users")
    .update({ is_email_verified: true })
    .eq("email", email);

  if (error) return res.status(500).json({ error: "Verification failed." });

  res.status(200).json({ message: "Email verified. Redirect to payment." });
});

module.exports = router;
