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
    db =
