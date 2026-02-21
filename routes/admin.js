const fs = require("fs")

module.exports = (app)=>{

// view all escorts
app.get("/admin",(req,res)=>{

let escorts = JSON.parse(fs.readFileSync("database.json"))

let html = escorts.map(e=>`
<div style="border:1px solid #000;padding:10px;margin:10px">
${e.name} - ${e.location} <br>
Approved: ${e.approved}

<form action="/admin/approve/${e.id}" method="POST">
<button>Approve</button>
</form>
</div>
`).join("")

res.send(html)

})


// approve escort
app.post("/admin/approve/:id",(req,res)=>{

let escorts = JSON.parse(fs.readFileSync("database.json"))

let escort = escorts.find(e=>e.id == req.params.id)
if(escort) escort.approved = true

fs.writeFileSync("database.json", JSON.stringify(escorts,null,2))
res.redirect("/admin")

})

  }
// ADMIN EARNINGS DASHBOARD
app.get("/admin/earnings",(req,res)=>{

let escorts = JSON.parse(fs.readFileSync("database.json"))

let total = 0

escorts.forEach(e=>{
if(e.lastPayment) total += e.lastPayment
})

res.send(`
<h1>Total Earnings: KSh ${total}</h1>
`)
})
