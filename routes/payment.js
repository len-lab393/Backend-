const fs = require("fs")
const {stkPush} = require("../mpesa")

module.exports = (app)=>{

// plan prices
const plans = {
daily:{amount:150,duration:2},
weekly:{amount:400,duration:7},
monthly:{amount:1200,duration:30}
}


// request payment
app.post("/pay/:id",(req,res)=>{

let escorts = JSON.parse(fs.readFileSync("database.json"))
let escort = escorts.find(e=>e.id == req.params.id)

if(!escort) return res.send("Escort not found")

let plan = req.body.plan
let phone = req.body.phone

if(!plans[plan]) return res.send("Invalid plan")

stkPush(phone,plans[plan].amount)

escort.pendingPlan = plan
fs.writeFileSync("database.json", JSON.stringify(escorts,null,2))

res.send("Payment request sent to phone")

})

}
