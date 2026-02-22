const fs = require("fs")

module.exports = (app) => {

// SIMULATED PAYMENT (we upgrade to real MPESA later)
app.post("/pay/:id", (req, res) => {

let escorts = JSON.parse(fs.readFileSync("database.json"))

let escort = escorts.find(e => e.id == req.params.id)

if (!escort) return res.send("Escort not found")

escort.contactUnlocked = true

fs.writeFileSync("database.json", JSON.stringify(escorts, null, 2))

res.send("Payment successful — contact unlocked")

})

}
