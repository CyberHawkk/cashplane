const express = require('express');
const crypto = require('crypto');
const supabase = require('../config/supabase');
const transporter = require('../config/email');

const router = express.Router();

router.post('/paystack', express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}), async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(req.rawBody)
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      console.warn('❌ Invalid Paystack signature');
      return res.sendStatus(403);
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const email = event.data.customer.email;

      // Generate referral code
      const referralCode = generateReferralCode();

      // Update user record with has_paid = true and referral_code
      const { error } = await supabase
        .from('users')
        .update({ has_paid: true, referral_code: referralCode })
        .eq('email', email);

      if (error) {
        console.error('Failed to update user payment/referral:', error);
        return res.sendStatus(500);
      }

      // Send referral code email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your CashPlane Referral Code',
        html: `<p>Thank you for your payment! Here is your referral code:</p><h2>${referralCode}</h2>`
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook error');
  }
});

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

module.exports = router;
