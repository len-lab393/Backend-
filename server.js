const express = require("express")
const fs = require("fs")
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// create database if missing
if (!fs.existsSync("database.json")) {
fs.writeFileSync("database.json", "[]")
}

// load routes
require("./routes/escort")(app)
require("./routes/payment")(app)
require("./routes/admin")(app)

// start server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
console.log("Server running on port " + PORT)
})
