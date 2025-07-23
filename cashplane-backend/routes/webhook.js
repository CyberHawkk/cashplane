const express = require("express");
const crypto = require("crypto");
const { db } = require("../firebase"); // your firebase.js setup
const { collection, getDocs, query, where, updateDoc } = require("firebase-admin/firestore");

const router = express.Router();

router.post(
  "/webhook/paystack",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
  async (req, res) => {
    try {
      const hash = crypto
        .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
        .update(req.rawBody)
        .digest("hex");

      if (hash === req.headers["x-paystack-signature"]) {
        const event = req.body;

        if (event.event === "charge.success") {
          const email = event.data.customer.email;

          const usersRef = db.collection("users");
          const snapshot = await usersRef.where("email", "==", email).get();

          if (snapshot.empty) {
            console.log("No user found with this email:", email);
          } else {
            snapshot.forEach(async (docRef) => {
              const referralCode = generateReferralCode();

              await docRef.ref.update({
                isActivated: true,
                referralCode,
              });
            });
          }
        }

        res.sendStatus(200);
      } else {
        console.warn("❌ Invalid Paystack signature");
        res.sendStatus(403);
      }
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).send("Webhook error");
    }
  }
);

// Dummy referral generator (replace with yours)
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

module.exports = router;
