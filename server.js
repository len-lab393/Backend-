const express = require("express");
const { stkPush } = require("./mpesa");

const app = express();
app.use(express.json());

app.post("/pay", async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const response = await stkPush(phone, amount);
    res.json(response.data);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.post("/callback", (req, res) => {
  console.log("Payment confirmed:", req.body);

  // unlock profile here later

  res.json({ ResultCode: 0, ResultDesc: "Success" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on", PORT));
