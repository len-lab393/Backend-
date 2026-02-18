require("dotenv").config();

const axios = require("axios");

// ---------- CONFIG ----------
const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortcode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASSKEY;
const callbackURL = process.env.CALLBACK_URL;

// ---------- GENERATE TIMESTAMP ----------
function getTimestamp() {
  const date = new Date();

  return date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0");
}

// ---------- GENERATE PASSWORD ----------
function generatePassword(timestamp) {
  const data = shortcode + passkey + timestamp;
  return Buffer.from(data).toString("base64");
}

// ---------- GET ACCESS TOKEN ----------
async function getAccessToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`
      }
    }
  );

  return response.data.access_token;
}

// ---------- STK PUSH PAYMENT ----------
async function stkPush(phone, amount, reference="Subscription") {
  try {
    const token = await getAccessToken();

    const timestamp = getTimestamp();
    const password = generatePassword(timestamp);

    const requestBody = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackURL,
      AccountReference: reference,
      TransactionDesc: "Payment"
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error("MPESA ERROR:", error.response?.data || error.message);
    return { error: true };
  }
}

module.exports = { stkPush };
