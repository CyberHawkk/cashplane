const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const transporter = require('../config/email');

// Middleware to parse JSON body
router.use(express.json());

/**
 * Register user and send email verification link
 */
router.post('/register', async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Insert new user with flags set false
  const { error } = await supabase
    .from('users')
    .insert([{
      name: fullname,
      email,
      password, // ⚠️ hash password in production!
      is_email_verified: false,
      has_paid: false,
      is_verified: false,
      referral_code: null,
    }]);

  if (error) return res.status(500).json({ error: 'Registration failed.' });

  // Send verification email
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - CashPlane',
    html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationLink}">${verificationLink}</a>`,
  });

  return res.status(200).json({ message: 'Verification email sent.' });
});

/**
 * Verify Email Route
 * (Called when user clicks email verification link)
 */
router.get('/verify-email', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).send('Missing email');

  const { error } = await supabase
    .from('users')
    .update({ is_email_verified: true })
    .eq('email', email);

  if (error) return res.status(500).send('Verification failed');

  res.send('Email verified successfully! Please proceed to payment.');
});

/**
 * Login Route
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password) // ⚠️ hash check in production
    .single();

  if (error || !data) return res.status(401).json({ error: 'Invalid credentials.' });

  if (!data.is_email_verified) {
    return res.status(403).json({ error: 'Please verify your email first.' });
  }

  if (!data.has_paid) {
    return res.status(403).json({ error: 'Please complete payment first.' });
  }

  if (!data.is_verified) {
    return res.status(403).json({ error: 'Please verify your referral code.' });
  }

  return res.status(200).json({ message: 'Login successful!', user: { email } });
});

module.exports = router;
