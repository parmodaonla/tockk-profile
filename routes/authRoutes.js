const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const User = require("../models/User");

const router = express.Router();

// SEND OTP
router.post("/send-otp", async (req, res) => {
try {

const { email } = req.body;

const otp = otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false
});

let user = await User.findOne({ email });

if (!user) {

  user = new User({
    name: "temp",
    username: "temp" + Date.now(),
    email: email,
    phone: "0000000000",
    password: "temp123",
    otp: otp
  });

} else {

  user.otp = otp;

}

await user.save();

console.log("OTP:", otp);

res.json({
  success: true,
  message: "OTP Sent Successfully"
});

} catch (error) {

res.status(500).json({
  success: false,
  message: error.message
});

}
});

// REGISTER
router.post("/register", async (req, res) => {

try {

const { name, email, phone, password, otp } = req.body;

const user = await User.findOne({ email });

if (!user) {
  return res.status(400).json({
    success: false,
    message: "Send OTP First"
  });
}

if (user.otp !== otp) {
  return res.status(400).json({
    success: false,
    message: "Invalid OTP"
  });
}

const username =
  name.toLowerCase().replace(/\s+/g, "") +
  Math.floor(1000 + Math.random() * 9000);

const hashedPassword = await bcrypt.hash(password, 10);

user.name = name;
user.username = username;
user.phone = phone;
user.password = hashedPassword;
user.otpVerified = true;

await user.save();

res.json({
  success: true,
  username: username,
  message: "Account Created Successfully"
});

} catch (error) {

res.status(500).json({
  success: false,
  message: error.message
});

}
});

// LOGIN
router.post("/login", async (req, res) => {

try {

const { email, password } = req.body;

const user = await User.findOne({ email });

if (!user) {
  return res.status(400).json({
    success: false,
    message: "User Not Found"
  });
}

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  return res.status(400).json({
    success: false,
    message: "Invalid Password"
  });
}

const token = jwt.sign(
  { id: user._id },
  "tockkSecretKey",
  { expiresIn: "7d" }
);

res.json({
  success: true,
  token,
  user
});

} catch (error) {

res.status(500).json({
  success: false,
  message: error.message
});

}
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {

try {

const { email, otp, newPassword } = req.body;

const user = await User.findOne({ email });

if (!user) {
  return res.status(400).json({
    success: false,
    message: "User Not Found"
  });
}

if (user.otp !== otp) {
  return res.status(400).json({
    success: false,
    message: "Invalid OTP"
  });
}

const hashedPassword = await bcrypt.hash(newPassword, 10);

user.password = hashedPassword;

await user.save();

res.json({
  success: true,
  message: "Password Updated Successfully"
});

} catch (error) {

res.status(500).json({
  success: false,
  message: error.message
});

}
});

module.exports = router;
