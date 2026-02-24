require("dotenv").config();
const express = require("express");
const { stkPush } = require("./mpesa");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => res.send("Server running successfully"));

// STK push route
app.post("/pay", (req, res) => {
  const { phone, amount } = req.body;
  stkPush(phone, amount)
    .then(response => res.json(response.data))
    .catch(err => res.status(500).json({ error: err.message }));
});

// callback
app.post("/callback", (req, res) => {
  console.log("Callback received:", req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
