const {transporter} = require("./email.config");
const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailVerificationTemplate");

const sendVerificationEmail = async(email, verificationToken)=>{
    console.log(process.env.EMAIL_APP_PASSWORD)
    console.log(process.env.appName)
    try {
        const response = await transporter.sendMail({
            from: '"KU Verse" <kuverse69@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify Your Email!", // Subject line
            text: "Hello world?", // plain text body
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken), // html body
          });
          console.log("Email sent successfully");
    } catch (error) {
        console.log({error});
        throw new Error("Error sending email verification")
    }

}

module.exports={sendVerificationEmail};