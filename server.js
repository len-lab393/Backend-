require("dotenv").config()

const express = require("express")
const cors = require("cors")
const { MongoClient, ObjectId } = require("mongodb")

const app = express()

app.use(cors())
app.use(express.json())

// ============================
// PORT
// ============================
const PORT = process.env.PORT || 5000

// ============================
// MONGO CONNECTION
// ============================
const client = new MongoClient(process.env.MONGO_URI)

let db

async function connectDB() {
  try {
    await client.connect()
    db = client.db("escort_platform")
    console.log("MongoDB connected")
  } catch (err) {
    console.error("Mongo connection error:", err)
    process.exit(1)
  }
}

connectDB()

// ============================
// HEALTH CHECK
// ============================
app.get("/", (req, res) => {
  res.send("API working 🚀")
})

// ============================
// CREATE ESCORT ACCOUNT
// ============================
app.post("/escort/register", async (req, res) => {
  try {
    const escort = {
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      phone: req.body.phone,
      location: {
        city: "Nairobi",
        area: req.body.area,
        street: req.body.street || ""
      },
      images: [],
      videos: [],
      subscriptionActive: false,
      subscriptionExpiry: null,
      createdAt: new Date()
    }

    const result = await db.collection("escorts").insertOne(escort)

    res.json({
      success: true,
      escortId: result.insertedId
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================
// GET ALL ACTIVE ESCORTS
// (Only subscribed + not expired)
// ============================
app.get("/escorts", async (req, res) => {
  try {
    const escorts = await db.collection("escorts").find({
      subscriptionActive: true,
      subscriptionExpiry: { $gt: new Date() }
    }).toArray()

    res.json(escorts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================
// UPDATE ESCORT PROFILE
// ============================
app.put("/escort/update/:id", async (req, res) => {
  try {
    const { name, age, gender, phone, area, street } = req.body

    await db.collection("escorts").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          name,
          age,
          gender,
          phone,
          "location.area": area,
          "location.street": street
        }
      }
    )

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================
// SUBSCRIBE ESCORT
// ============================
app.post("/escort/subscribe/:id", async (req, res) => {
  try {
    const { plan } = req.body

    let days = 0

    if (plan === "2days") days = 2
    if (plan === "week") days = 7
    if (plan === "month") days = 30

    const expiry = new Date()
    expiry.setDate(expiry.getDate() + days)

    await db.collection("escorts").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          subscriptionActive: true,
          subscriptionExpiry: expiry
        }
      }
    )

    res.json({
      success: true,
      expires: expiry
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================
// UPLOAD IMAGES (MAX 3)
// ============================
app.post("/escort/upload-images/:id", async (req, res) => {
  try {
    const { images } = req.body

    if (!images || images.length < 1 || images.length > 3) {
      return res.status(400).json({
        error: "Minimum 1 image, maximum 3 images"
      })
    }

    await db.collection("escorts").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { images } }
    )

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================
// UPLOAD VIDEOS (MAX 2)
// ============================
app.post("/escort/upload-videos/:id", async (req, res) => {
  try {
    const { videos } = req.body

    if (videos && videos.length > 2) {
      return res.status(400).json({
        error: "Maximum 2 videos allowed"
      })
    }

    await db.collection("escorts").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { videos } }
    )

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================
// START SERVER
// ============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
app.post("/callback", (req, res) => {
  console.log(req.body)
  res.send("ok")
})
