const nodemailer = require('nodemailer');
require('dotenv').config();

// More secure alternative configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
    tls: {
        // Only reject invalid certificates, not self-signed ones
        ciphers: 'SSLv3',
        rejectUnauthorized: true,
        // You can also specify custom CA if needed
        // ca: [fs.readFileSync('path/to/certificate.pem')]
    }
});

module.exports = { transporter };