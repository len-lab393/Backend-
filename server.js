require("dotenv").config()
const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ===== Railway PORT FIX =====
const PORT = process.env.PORT || 3000


// ===== health route (check backend running) =====
app.get("/", (req, res) => {
  res.send("Backend running 🚀")
})


// ===== create users file =====
if (!fs.existsSync("users.json")) {
  fs.writeFileSync("users.json", "[]")
}


// ===== REGISTER =====
app.post("/register", (req, res) => {
  const { username, password } = req.body

  const users = JSON.parse(fs.readFileSync("users.json"))

  const exists = users.find(u => u.username === username)

  if (exists) return res.send("User already exists")

  users.push({ username, password })
  fs.writeFileSync("users.json", JSON.stringify(users))

  res.redirect("https://junioremperor54-tech.github.io/UK-Worldwide-escorts/login.html")
})


// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { username, password } = req.body

  const users = JSON.parse(fs.readFileSync("users.json"))

  const user = users.find(
    u => u.username === username && u.password === password
  )

  if (!user) return res.send("Invalid username or password")

  res.redirect("https://junioremperor54-tech.github.io/UK-Worldwide-escorts/dashboard.html")
})


// ===== start server =====
app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})
