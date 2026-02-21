const fs = require("fs")

module.exports = (app)=>{

app.post("/register",(req,res)=>{

let escorts = JSON.parse(fs.readFileSync("database.json"))

let newEscort = {
id: Date.now(),
name:req.body.name,
age:req.body.age,
location:req.body.location,
phone:req.body.phone,
description:req.body.description,
approved:false,
paid:false,
plan:null,
expiry:null
}

escorts.push(newEscort)
fs.writeFileSync("database.json", JSON.stringify(escorts,null,2))

res.send("Registration submitted. Waiting for admin approval.")

})

}
