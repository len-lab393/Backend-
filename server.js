require("dotenv").config()
const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ===== create users file if not exists =====
if (!fs.existsSync("users.json")) {
  fs.writeFileSync("users.json", "[]")
}

// ===== REGISTER =====
app.post("/register", (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.send("Fill all fields")
  }

  const users = JSON.parse(fs.readFileSync("users.json"))

  const exists = users.find(u => u.username === username)

  if (exists) {
    return res.send("User already exists")
  }

