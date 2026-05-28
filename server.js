const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// AUTH ROUTES
app.use("/api/auth", authRoutes);


// MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log("MongoDB Connected Successfully");
})
.catch((err) => {
  console.log("Mongo Error:", err.message);
});


// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Tockk Profile API Running");
});


// SERVER
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
