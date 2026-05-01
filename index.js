const fs = require("fs");
const nodemailer = require("nodemailer");

// Load env variables from GitHub Secrets
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

// Read birthdays.json
const friends = JSON.parse(fs.readFileSync("data/birthdays.json", "utf8"));

// Get today's date in MM-DD format
const today = new Date();
const todayStr =
  String(today.getDate()).padStart(2, "0") +
  "-" +
  String(today.getMonth() + 1).padStart(2, "0");

// Filter friends with birthday today
const todayFriends = friends.filter(f => f.dob === todayStr);

// If none, exit early
if (todayFriends.length === 0) {
  console.log("No birthdays today 🎂");
  process.exit(0);
}

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

// Send emails
todayFriends.forEach(friend => {
  const mailOptions = {
    from: emailUser,
    to: friend.email,
    subject: "🎉 Happy Birthday!",
    text: `Hey ${friend.name} 🎉

Happy Birthday!

Don’t get too carried away 😄 sabka hota hai ek na ek din toh 🎂

Enjoy your day like a legend—cake, chaos, and celebration all included 🚀`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending to", friend.email, err);
    } else {
      console.log("Sent:", friend.email, info.response);
    }
  });
});
