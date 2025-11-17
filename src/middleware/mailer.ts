import nodemailer from 'nodemailer';
import secrets from '../secrets.js';

const mailerSecure = secrets.MAILER_SECURE.toLowerCase();
const mailer = nodemailer.createTransport({
  host: secrets.MAILER_HOST,
  port: +secrets.MAILER_PORT,
  secure: mailerSecure === 'true',
  auth: {
    user: secrets.MAILER_USER,
    pass: secrets.MAILER_PASSWORD,
  },
});

const sendMail = async (content: {
  sendTo: string;
  subject: string;
  html: string;
}) => {
  return mailer.sendMail({
    from: `"${secrets.MAILER_FROM_NAME}"<${secrets.MAILER_FROM}>`,
    to: content.sendTo,
    subject: content.subject,
    html: content.html,
  });
};
export default sendMail;
