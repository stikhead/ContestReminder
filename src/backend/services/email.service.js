import "dotenv/config";
import Mailjet from "node-mailjet";
import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: process.env.SMTP_ETHREAL_NAME,
//         pass: process.env.SMTP_ETHREAL_PASSWORD
//     }
// });

// const sendVerificationEmail = async (email, otp)=>{
//     try {
//         const info = await transporter.sendMail({
//             from: `"Test App" <${process.env.SMTP_ETHREAL_NAME}>`,
//             to: `${email}`,
//             subject: "Hello from Ethereal!",
//             text: `"This message was sent using Ethereal ${otp}."`,
//             html: `<p>This message was sent using <b>Ethereal</b> ${otp}.</p>`,
//           });
//         console.log(otp)
//         console.log("Message sent: %s", info.messageId);
//         console.log("Preview: %s", nodemailer.getTestMessageUrl(info))
        
//     } catch (error) {
//         console.log(`an error occured: ${error}`)
//         throw error;
//     }    
// }

const mailjet = new Mailjet({
  apiKey: `${process.env.MJ_APIKEY_PUBLIC}`,
  apiSecret: `${process.env.MJ_APIKEY_PRIVATE}`
});

const sendVerificationEmail = async (email, otp) => {
  try {
    const request = await mailjet.post("send", { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MJ_SENDER_EMAIL,
            Name: "Contest Reminder Support"
          },
          To: [
            {
              Email: email,
              Name: "User"
            }
          ],
          Subject: "Verify your Account",
          TextPart: `Your verification code is: ${otp}`,
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #2563eb;">Welcome!</h2>
              <p>Your 6-digit verification code is:</p>
              <h1 style="background: #f3f4f6; padding: 10px; border-radius: 5px; text-align: center; letter-spacing: 5px; color: #1e40af;">
                ${otp}
              </h1>
              <p style="color: #666; font-size: 12px;">This code will expire shortly. If you didn't request this, please ignore this email.</p>
            </div>
          `
        }
      ]
    });

    console.log("Email sent successfully!");
    console.log("Status:", request.response.status);
    
  } catch (error) {
    console.error(`Mailjet Error: ${error.statusCode || error.message}`);
    throw error;
  }
};

export {sendVerificationEmail}

