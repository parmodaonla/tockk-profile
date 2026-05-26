const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Tockk Profile API Running");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
