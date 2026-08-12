const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendResignationDecisionEmail = async ({
  email,
  username,
  approved,
  exitDate,
}) => {
  if (!email) {
    console.log(
      `No email configured for employee ${username}. Notification skipped.`
    );
    return;
  }

  const status = approved ? "approved" : "rejected";

  const subject = approved
    ? "Resignation Approved"
    : "Resignation Rejected";

  const text = approved
    ? `Hello ${username},

Your resignation request has been approved.

Exit date: ${exitDate}

Regards,
HR`
    : `Hello ${username},

Your resignation request has been rejected.

Regards,
HR`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    text,
  });

  console.log(`Resignation ${status} email sent to ${email}`);
};

module.exports = {
  sendResignationDecisionEmail,
};