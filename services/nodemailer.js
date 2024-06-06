import "dotenv/config";

import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d6ad908720302c",
    pass: "89c716fd3a0782",
  },
});

// {
//   user: process.env.MAILTRAP_USERNAME,
//   pass: process.env.MAILTRAP_PASSWORD,
// },

function sendMail(message) {
  return transport.sendMail(message);
}

export default { sendMail };

// transport.sendMail(message).then(console.log).catch(console.error);
