import nodemailer from "nodemailer";
import "dotenv/config";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

// {
//   user: process.env.MAILTRAP_USERNAME,
//   pass: process.env.MAILTRAP_PASSWORD,
// },

// user: "d6ad908720302c",
//     pass: "89c716fd3a0782",

function sendMail(message) {
  console.log(process.env.MAILTRAP_USERNAME);
  return transport.sendMail(message);
}

export default { sendMail };
