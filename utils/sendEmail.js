const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (verifyMail) => {
  try {
    await sgMail.send({ ...verifyMail, from: 'sili41995@gmail.com' });
    console.log('send email success');
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
