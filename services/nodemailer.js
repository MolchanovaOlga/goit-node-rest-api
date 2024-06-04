import "dotenv/config";

import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const message = {
  to: ["designer.molchanova@gmail.com"],
  from: "designer.molchanova@gmail.com",
  subject: "Bla bla",
  html: `<h1>Bla bla</h1>`,
  text: "Bla bla",
};

transport.sendMail(message).then(console.log).catch(console.error);
