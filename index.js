const fs = require("fs");
const nodemailer = require("nodemailer");

// Load env variables from GitHub Secrets
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
  process.exit(1);
}

let friends;
try {
  friends = JSON.parse(fs.readFileSync("data/birthdays.json", "utf8"));
} catch (error) {
  console.error("Unable to read birthdays.json:", error);
  process.exit(1);
}

const today = new Date();
const todayStr = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "2-digit",
}).format(today).replace("/", "-");

const todayFriends = friends.filter(f => f.dob === todayStr);

if (todayFriends.length === 0) {
  console.log("No birthdays today 🎂");
  process.exit(0);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

async function sendBirthdayEmails() {
  for (const friend of todayFriends) {
    const mailOptions = {
      from: emailUser,
      to: friend.email,
      subject: "🎉 Happy Birthday!",
      text: `Hey ${friend.name} 🎉

Happy Birthday!

Don’t get too carried away 😄 sabka hota hai ek na ek din toh 🎂

Enjoy your day like a legend—cake, chaos, and celebration all included 🚀`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Sent:", friend.email, info.response);
    } catch (error) {
      console.error("Error sending to", friend.email, error);
    }
  }
}

sendBirthdayEmails().catch(error => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
