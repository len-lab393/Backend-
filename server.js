require("dotenv").config()
const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

// ===== health check =====
app.get("/", (req, res) => {
  res.send("Backend running")
})

// ===== users file =====
if (!fs.existsSync("users.json")) {
  fs.writeFileSync("users.json", "[]")
}

// ===== REGISTER =====
app.post("/register", (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.json({ success:false, msg:"Fill all fields" })

  const users = JSON.parse(fs.readFileSync("users.json"))

  if (users.find(u => u.email === email))
    return res.json({ success:false, msg:"Email exists" })

  users.push({ email, password, plan:"none" })
  fs.writeFileSync("users.json", JSON.stringify(users))

  res.json({ success:true })
})

// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { email, password } = req.body

  const users = JSON.parse(fs.readFileSync("users.json"))

  const user = users.find(
    u => u.email === email && u.password === password
  )

  if (!user)
    return res.json({ success:false, msg:"Invalid login" })

  res.json({ success:true, plan:user.plan })
})

// ===== BUY PLAN (simulate payment) =====
app.post("/buy", (req, res) => {
  const { email, plan } = req.body

  const users = JSON.parse(fs.readFileSync("users.json"))

  const user = users.find(u => u.email === email)
  if (!user) return res.json({ success:false })

  user.plan = plan
  fs.writeFileSync("users.json", JSON.stringify(users))

  res.json({ success:true })
})

app.listen(PORT, () => console.log("Running", PORT))
