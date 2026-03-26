import "dotenv/config";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.SMTP_ETHREAL_NAME,
        pass: process.env.SMTP_ETHREAL_PASSWORD
    }
});

const sendVerificationEmail = async (email, token)=>{
    try {
        const info = await transporter.sendMail({
            from: `"Test App" <${process.env.SMTP_ETHREAL_NAME}>`,
            to: `${email}`,
            subject: "Hello from Ethereal!",
            text: `"This message was sent using Ethereal ${token}."`,
            html: `<p>This message was sent using <b>Ethereal</b> ${token}.</p>`,
          });
        
        console.log("Message sent: %s", info.messageId);
        console.log("Preview: %s", nodemailer.getTestMessageUrl(info))
        
    } catch (error) {
        console.log(`an error occured: ${error}`)
        throw error;
    }    
}

export {sendVerificationEmail}

