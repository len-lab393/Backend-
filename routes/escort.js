const fs = require("fs")

module.exports = (app) => {

// GET ALL APPROVED ESCORTS
app.get("/escorts", (req, res) => {

let escorts = JSON.parse(fs.readFileSync("database.json"))

let approved = escorts.filter(e => e.approved === true)

res.json(approved)

})


// REGISTER ESCORT (AUTO PAGE GENERATOR)
app.post("/escort/register", (req, res) => {

let escorts = JSON.parse(fs.readFileSync("database.json"))

const newEscort = {
id: Date.now(),
name: req.body.name,
location: req.body.location,
approved: false,
contactUnlocked: false,
photos: []
}

escorts.push(newEscort)

fs.writeFileSync("database.json", JSON.stringify(escorts, null, 2))

res.send("Profile submitted for approval")

})


// SINGLE PROFILE
app.get("/escort/:id", (req, res) => {

let escorts = JSON.parse(fs.readFileSync("database.json"))

let escort = escorts.find(e => e.id == req.params.id)

if (!escort) return res.send("Escort not found")

res.json(escort)

})

}
