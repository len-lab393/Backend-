const fs = require("fs")

module.exports = (app)=>{

// marketplace list
app.get("/escorts",(req,res)=>{

let escorts = JSON.parse(fs.readFileSync("database.json"))

let approved = escorts.filter(e=>e.approved)

let html = approved.map(e=>`
<a href="/escort/${e.id}">
<div style="padding:15px;border:1px solid #ddd;margin:10px">
<h3>${e.name}</h3>
Location: ${e.location}
</div>
</a>
`).join("")

res.send(html || "No escorts yet")

})


// single escort profile
app.get("/escort/:id",(req,res)=>{

let escorts = JSON.parse(fs.readFileSync("database.json"))
let escort = escorts.find(e=>e.id == req.params.id)

if(!escort) return res.send("Escort not found")

if(!escort.approved){
return res.send("Profile pending approval")
}
if(escort.expiry && Date.now() > escort.expiry){
escort.approved = false
escort.paid = false
                       }
res.send(`
<h1>${escort.name}</h1>
Age: ${escort.age}<br>
Location: ${escort.location}<br>
<p>${escort.description}</p>

<hr>

${escort.paid
? `Phone: ${escort.phone}`
: `<form action="/unlock/${escort.id}" method="POST">
<button>Pay to Unlock Contact</button>
</form>`
}
`)

})

  }
