const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure dotenv is configured first

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

const sendEmail = async (toEmail, taskDetails) => {
  const { taskName, deadline, eventName } = taskDetails;

  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: toEmail,
    subject: `New Task Assigned: ${taskName}`,
    text: `You have been assigned a new task for the event ${eventName}.\n\nTask: ${taskName}\nDeadline: ${new Date(deadline).toISOString().split('T')[0]}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email sending failed');
  }
};

module.exports = sendEmail;


