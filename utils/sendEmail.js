const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY, BASE_URL } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async ({ email, verificationToken }) => {
  try {
    await sgMail.send({
      to: email,
      from: 'sili41995@gmail.com',
      subject: 'Verify email',
      html: `<a target='_blank' href='${BASE_URL}/api/auth/verify/${verificationToken}'>Verify my email</a>`,
    });
    console.log('send email success');
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
