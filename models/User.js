const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

name: {
type: String,
required: true
},

username: {
type: String,
required: true,
unique: true
},

email: {
type: String,
required: true,
unique: true
},

phone: {
type: String,
required: true
},

password: {
type: String,
required: true
},

otp: {
type: String,
default: ""
},

otpVerified: {
type: Boolean,
default: false
},

profilePic: {
type: String,
default: ""
},

bio: {
type: String,
default: ""
}

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
