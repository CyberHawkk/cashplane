// config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // your Gmail address (from .env)
    pass: process.env.EMAIL_PASSWORD, // your Gmail app password (from .env)
  },
});

module.exports = transporter;
