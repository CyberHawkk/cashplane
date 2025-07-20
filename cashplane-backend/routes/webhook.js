const express = require("express");
const crypto = require("crypto");
const { db } = require("../firebase"); // Your Firebase setup
const {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} = require("firebase/firestore");

const router = express.Router();

router.post("/webhook/paystack", express.json({ verify: (req, res, buf) => {
  req.rawBody = buf;
} }), async (req, res) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash === req.headers["x-paystack-signature"]) {
    const event = req.body;

    if (event.event === "charge.success") {
      const email = event.data.customer.email;

      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      snapshot.forEach(async (docRef) => {
        const referralCode = generateReferralCode(); // Define or import this

        await updateDoc(doc(db, "users", docRef.id), {
          isActivated: true,
          referralCode: referralCode,
        });

        sendReferralEmail(email, referralCode); // optional function
      });
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
