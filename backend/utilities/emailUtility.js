const { transporter } = require("./email.config");
const { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE , PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./emailVerificationTemplate");

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: '"KU Verse" <kuverse69@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Verify Your Email!", // Subject line
      text: "Hello world?", // plain text body
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ), // html body
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log({ error });
    throw new Error("Error sending email verification");
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: '"KU Verse" <kuverse69@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Reset Your Password", // Subject line
      text: "Hello world?", // plain text body
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL), // html body
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log({ error });
    throw new Error("Error sending password reset email!");
  }
};

const sendPasswordResetSuccessEmail = async (email) => {
  try {
    const response = await transporter.sendMail({
      from: '"KU Verse" <kuverse69@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Password reset succesfully", // Subject line
      text: "Hello world?", // plain text body
      html: PASSWORD_RESET_SUCCESS_TEMPLATE, // html body
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log({ error });
    throw new Error("Error sending password reset success email!");
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail , sendPasswordResetSuccessEmail};
