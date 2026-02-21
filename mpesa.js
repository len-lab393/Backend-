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
// MPESA CALLBACK
app.post("/callback",(req,res)=>{

try{

let escorts = JSON.parse(fs.readFileSync("database.json"))

let escort = escorts.find(e => e.pendingPlan)
if(!escort) return res.send("No pending payment")

const plans = {
two_days:{amount:150,days:2},
weekly:{amount:400,days:7},
monthly:{amount:1200,days:30}
}

let planData = plans[escort.pendingPlan]

// activate escort
escort.paid = true
escort.approved = true
escort.plan = escort.pendingPlan
escort.expiry = Date.now() + planData.days*24*60*60*1000

// store earnings
escort.lastPayment = planData.amount

escort.pendingPlan = null

fs.writeFileSync("database.json", JSON.stringify(escorts,null,2))

res.send("OK")

}catch(err){
console.log(err)
res.send("callback error")
}

})
