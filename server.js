require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================
// TEMP DATABASE (memory)
// ============================

let users = [];

// ============================
// HOME TEST
// ============================

app.get("/", (req, res) => {
  res.send("Backend running");
});

// ============================
// REGISTER USER
// ============================

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });

  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: "User exists" });

  users.push({
    email,
    password,
    plan: null,
    membershipExpires: null
  });

  res.json({ message: "Registered successfully" });
});

// ============================
// LOGIN
// ============================

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ error: "Invalid login" });

  res.json({ message: "Login success", user });
});

// ============================
// SHOW PLANS (frontend fetches this)
// ============================

app.get("/plans", (req, res) => {
  res.json([
    { name: "2 Days", price: 150, days: 2 },
    { name: "Weekly", price: 400, days: 7 },
    { name: "Monthly", price: 1200, days: 30 }
  ]);
});

// ============================
// CHECK MEMBERSHIP
// ============================

app.post("/check-membership", (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) return res.status(404).json({ error: "User not found" });

  if (!user.plan || Date.now() > user.membershipExpires)
    return res.json({ active: false });

  res.json({ active: true, plan: user.plan });
});

// ============================
// SAFARICOM MPESA CONFIG
// ============================

const SHORTCODE = process.env.SHORTCODE;
const PASSKEY = process.env.PASSKEY;
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

// get token
function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

  return axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  ).then(res => res.data.access_token);
}

// ============================
// PAY → TRIGGER STK PUSH
// ============================

app.post("/pay", async (req, res) => {
  const { phone, amount, email, days } = req.body;

  try {
    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${SHORTCODE}${PASSKEY}${timestamp}`
    ).toString("base64");

    await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: email,
        TransactionDesc: "Membership Payment"
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // TEMP: activate membership immediately (real system waits for callback)
    const user = users.find(u => u.email === email);
    if (user) {
      user.plan = amount;
      user.membershipExpires = Date.now() + days * 24 * 60 * 60 * 1000;
    }

    res.json({ message: "Payment request sent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// CALLBACK (for real MPesa)
// ============================

app.post("/callback", (req, res) => {
  console.log("MPesa result:", req.body);
  res.sendStatus(200);
});

// ============================
// START SERVER
// ============================

const PORT = process.env.PORT || 3000;
// ============================
// ADMIN DATA
// ============================

app.get("/admin-data", (req,res)=>{
res.json(users);
});
app.listen(PORT, () => {
  console.log("Server started");
});
