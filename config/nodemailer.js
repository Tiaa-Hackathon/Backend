const nodeMailer = require("nodemailer");
// const hbs = require("nodemailer-express-handlebars");
// const path = require("path");
require("dotenv").config();

const transporter = nodeMailer.createTransport({
  port: 587,
  secure: false, // true for 465, false for other ports
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// transporter.use(
//   "compile",
//   hbs({
//     viewEngine: {
//       extName: ".handlebars",
//       partialsDir: path.resolve(__dirname, "../templates/"),
//       defaultLayout: false,
//     },
//     viewPath: path.resolve(__dirname, "../templates/"),
//     extName: ".handlebars",
//   })
// );

// const sendResetPassword = async (to, token) => {
//   const mailOptions = {
//     from: process.env.GMAIL_EMAIL,
//     to: to,
//     subject: "Reset Password",
//     attachments: [
//       {
//         filename: "image-1.png",
//         path: "/app/public/images/mail/image-1.png",
//         cid: "image-1",
//       },
//       {
//         filename: "image-2.png",
//         path: "/app/public/images/mail/image-1.png",
//         cid: "image-2",
//       },
//       {
//         filename: "image-3.png",
//         path: "/app/public/images/mail/image-3.png",
//         cid: "image-3",
//       },
//       {
//         filename: "image-4.png",
//         path: "/app/public/images/mail/image-4.png",
//         cid: "image-4",
//       },
//       {
//         filename: "image-5.png",
//         path: "/app/public/images/mail/image-5.png",
//         cid: "image-5",
//       },
//       {
//         filename: "image-6.png",
//         path: "/app/public/images/mail/image-6.png",
//         cid: "image-6",
//       },
//       {
//         filename: "image-7.png",
//         path: "/app/public/images/mail/image-7.png",
//         cid: "image-7",
//       },
//     ],
//     // text: 'Reset Password',
//     // html: `<p>Click <a href="${process.env.FRONTEND_DOMAIN}/reset-password/${token}">here</a> to reset your password</p>`,
//     template: "reset-password",
//     context: {
//       token,
//       FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN,
//     },
//   };

//   try {
//     return await transporter.sendMail(mailOptions);
//   } catch (err) {
//     throw err;
//   }
// };

const sendResetPassword = async (to, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: to,
    subject: "Reset Password",
    text: "Reset Password",
    html: `<p>Here is your otp to reset your password: ${otp}</p>`,
    // template: "reset-password",
    // context: {
    //   token,
    //   FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN,
    // },
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  mail: transporter,
  sendResetPassword,
};
