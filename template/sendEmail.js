import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

export async function sendSimpleMessage(
  userEmail,
  userName,
  contestId,
  contestTime,
) {
  const mailgun = new Mailgun(FormData);
  const domain = process.env.MAILGUN_DOMAIN;
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  });
  try {
    const data = await mg.messages.create(domain, {
      from: `Mailgun Sandbox <postmaster@${domain}>`,
      to: [userEmail],
      subject: `Hello ${userName}`,
      text: `Congratulations ${userName}, you just sent an email with Mailgun! You are truly awesome!`,
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}
