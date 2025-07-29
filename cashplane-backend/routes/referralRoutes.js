const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.use(express.json());

router.post('/verify-referral', async (req, res) => {
  const { email, referralCode } = req.body;

  if (!email || !referralCode) {
    return res.status(400).json({ error: 'Email and referral code required.' });
  }

  const { data, error } = await supabase
    .from('users')
    .select('referral_code')
    .eq('email', email)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (data.referral_code !== referralCode.toUpperCase()) {
    return res.status(400).json({ error: 'Invalid referral code.' });
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({ is_verified: true })
    .eq('email', email);

  if (updateError) {
    return res.status(500).json({ error: 'Failed to verify referral code.' });
  }

  return res.status(200).json({ message: 'Referral code verified successfully!' });
});

module.exports = router;
