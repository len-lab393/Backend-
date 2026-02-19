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
  users.push({ username, password })
  fs.writeFileSync("users.json", JSON.stringify(users))

  // redirect back to login page (your frontend)
  res.redirect("https://junioremperor54-tech.github.io/UK-Worldwide-escorts/login.html")
})


// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { username, password } = req.body

  const users = JSON.parse(fs.readFileSync("users.json"))

  const user = users.find(
    u => u.username === username && u.password === password
  )

  if (!user) {
    return res.send("Invalid username or password")
  }

  // redirect to dashboard
  res.redirect("https://junioremperor54-tech.github.io/UK-Worldwide-escorts/dashboard.html")
})


// ===== START SERVER =====
app.listen(3000, () => {
  console.log("Server running")
})

