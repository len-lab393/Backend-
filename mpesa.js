require("dotenv").config()
const axios = require("axios")

// GET ACCESS TOKEN
async function getAccessToken(){

const auth = Buffer.from(
process.env.MPESA_CONSUMER_KEY + ":" + process.env.MPESA_CONSUMER_SECRET
).toString("base64")

const res = await axios.get(
"https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
{
headers:{Authorization:`Basic ${auth}`}
})

return res.data.access_token
}


// SEND STK PUSH
async function stkPush(phone,amount){

const token = await getAccessToken()

const timestamp = new Date()
.toISOString()
.replace(/[^0-9]/g,"")
.slice(0,-3)

const password = Buffer.from(
process.env.MPESA_SHORTCODE +
process.env.MPESA_PASSKEY +
timestamp
).toString("base64")

return axios.post(
"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
{
BusinessShortCode:process.env.MPESA_SHORTCODE,
Password:password,
Timestamp:timestamp,
TransactionType:"CustomerPayBillOnline",
Amount:amount,
PartyA:phone,
PartyB:process.env.MPESA_SHORTCODE,
PhoneNumber:phone,
CallBackURL:process.env.CALLBACK_URL,
AccountReference:"EscortPayment",
TransactionDesc:"Profile Payment"
},
{
headers:{Authorization:`Bearer ${token}`}
})

}

module.exports = {stkPush}
