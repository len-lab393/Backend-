const fs = require("fs")

module.exports = (app)=>{

// =======================
// VIEW APPROVED ESCORTS LIST
// =======================
app.get("/escorts",(req,res)=>{

let escorts = JSON.parse(fs.readFileSync("database.json"))

let approved = escorts.filter(e => e.approved === true)

let html = approved.map(e=>`
<div style="border:1px solid #000;padding:10px;margin:10px">
<h3>${e.name}</h3>
<p>${e.location}</p>
<a href="/escort/${e.id}">View Profile</a>
</div>
`).join("")

res.send(html)

})


// =======================
// SINGLE ESCORT PROFILE PAGE
// =======================
app.get("/escort/:id",(req,res)=>{

let escorts = JSON.parse(fs.readFileSync("database.json"))

let escort = escorts.find(e=>e.id == req.params.id)

if(!escort) return res.send("Escort not found")

res.send(`
<h1>${escort.name}</h1>
<p>${escort.location}</p>

<h3>Contact Locked 🔒</h3>
<p>Pay to unlock contact</p>
`)

})

  }
