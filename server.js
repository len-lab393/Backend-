require("dotenv").config();

const express = require("express");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  res.send("Server running successfully");
});

// callback route (needed later for MPesa)
app.post("/callback", (req, res) => {
  console.log("Callback received:", req.body);
  res.sendStatus(200);
});

// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
