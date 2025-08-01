// const nodemailer = require ('nodemailer')

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       // user: process.env.hudavkd1@gmail.com,
//       // pass: process.env.vces aagb zpfn zilq, // use app password
//     },
//   });

//   module.exports = {transporter}



const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
});

module.exports = { transporter };



