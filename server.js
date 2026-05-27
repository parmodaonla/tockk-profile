const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log("MongoDB Connected Successfully");
})
.catch((err) => {
  console.log("Mongo Error:", err.message);
});

app.get("/", (req,res)=>{
  res.send("Tockk Profile API Running");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, ()=>{
  console.log(`Server running on ${PORT}`);
});
