const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const transporter = require("../config/email");
const { v4: uuidv4 } = require("uuid");

// ✅ Called after successful payment
router.post("/payment-success", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email required." });

  const referralCode = uuidv4().slice(0, 8).toUpperCase();

  const { error } = await supabase
    .from("users")
    .update({
      has_paid: true,
      referral_code: referralCode,
    })
    .eq("email", email);

  if (error) return res.status(500).json({ error: "Payment update failed." });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Referral Code - KwikEarn",
    html: `<p>Thanks for your payment!</p><p>Your referral code is: <strong>${referralCode}</strong></p>`,
  });

  res.status(200).json({ message: "Referral code sent via email." });
});

module.exports = router;
