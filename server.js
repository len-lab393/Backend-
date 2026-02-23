// temporary storage (later we use database)
let activeUsers = {};
require("dotenv").config();
const express = require("express");
const { stkPush } = require("./mpesa");

const app = express();
app.use(express.json());

/* ----------- HEALTH CHECK ROUTE ----------- */
app.get("/", (req, res) => {
  res.send("Backend alive");
});

/* ----------- PAYMENT ROUTE ----------- */
app.post("/pay", async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const response = await stkPush(phone, amount);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json("Payment error");
  }
});

/* ----------- CALLBACK ROUTE ----------- */
app.post("/callback", (req, res) => {
  console.log("Payment confirmed:", req.body);

  // example phone (later extract from mpesa response)
  const phone = "254708374149";

  // unlock for 2 days (172800000 ms)
  activeUsers[phone] = Date.now() + 172800000;

  res.json({ message: "Payment received & user unlocked" });
});

/* ----------- VERY IMPORTANT FOR RAILWAY ----------- */
const PORT = process.env.PORT || 3000;

/* bind to 0.0.0.0 so Railway can access it */
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
app.get("/check-access/:phone", (req, res) => {
  const phone = req.params.phone;

  if (!activeUsers[phone])
    return res.json({ access: false });

  if (Date.now() > activeUsers[phone]) {
    delete activeUsers[phone];
    return res.json({ access: false });
  }

  res.json({ access: true });
});
