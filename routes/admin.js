const fs = require("fs")

module.exports = (app) => {

// APPROVE PROFILE
app.post("/admin/approve/:id", (req, res) => {

let escorts = JSON.parse(fs.readFileSync("database.json"))

let escort = escorts.find(e => e.id == req.params.id)

if (!escort) return res.send("Escort not found")

escort.approved = true

fs.writeFileSync("database.json", JSON.stringify(escorts, null, 2))

res.send("Escort approved")

})


// VIEW ALL ESCORTS (ADMIN DASHBOARD)
app.get("/admin/escorts", (req, res) => {

let escorts = JSON.parse(fs.readFileSync("database.json"))

res.json(escorts)

})

}
