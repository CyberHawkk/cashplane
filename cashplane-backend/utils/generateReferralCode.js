function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
module.exports = generateReferralCode;
