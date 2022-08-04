const HttpError = require('./HttpError');
var nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transport.sendMail(mailOptions);

  console.log(`Mail sent: ${info.messageId}`.green);
};

module.exports = sendEmail;
