// ===== IMPORTS =====
require("dotenv").config()
const express = require("express")
const cors = require("cors")

// ===== INIT APP =====
const app = express()

// ===== MIDDLEWARE =====
app.use(cors())
app.use(express.json())

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("API working 🚀")
})

/* ================= DATABASE CONNECTION ================= */

const client = new MongoClient(process.env.MONGO_URL);

let db;

async function start(){
try{
await client.connect();
db = client.db("escortDB");
console.log("Database connected");
}catch(err){
console.log("DB connection error", err);
}
}

start();

/* ================= AUTO EXPIRE ACCOUNTS ================= */

async function expireAccounts(){

const now = new Date();

await db.collection("escorts").updateMany(
{ expiresAt: { $lt: now } },
{ $set:{ active:false } }
);

}

/* ================= REGISTER ESCORT (FREE ACCOUNT) ================= */
/* Account created but hidden until subscription */

app.post("/register", async (req,res)=>{

try{

const { email } = req.body;

if(!email){
return res.status(400).json({error:"Email required"});
}

const exists = await db.collection("escorts").findOne({email});

if(exists){
return res.json({message:"Account already exists"});
}

await db.collection("escorts").insertOne({
email,

/* profile info */
name:"",
age:"",
gender:"",
phone:"",

/* location */
city:"Nairobi",  // fixed
area:"",         // required later
street:"",       // optional

/* media */
images:[],
videos:[],

/* subscription */
active:false,
subscription:null,
expiresAt:null,

createdAt:new Date()
});

res.json({message:"Account created. Subscribe to publish."});

}catch(err){
res.status(500).json({error:"Server error"});
}

});

/* ================= SUBSCRIBE → ACTIVATE ACCOUNT ================= */
/* days = 2 or 7 or 30 */

app.post("/subscribe", async (req,res)=>{

try{

const { email, days } = req.body;

if(!email || !days){
return res.status(400).json({error:"Missing data"});
}

const expiry = new Date();
expiry.setDate(expiry.getDate() + Number(days));

await db.collection("escorts").updateOne(
{ email },
{
$set:{
active:true,
subscription:days + "days",
expiresAt:expiry
}
}
);

res.json({message:"Account published"});

}catch(err){
res.status(500).json({error:"Server error"});
}

});

/* ================= UPDATE PROFILE (EDIT INFO) ================= */

app.post("/update-profile", async (req,res)=>{

try{

const {
email,
name,
age,
gender,
phone,
area,
street
} = req.body;

if(!email){
return res.status(400).json({error:"Email required"});
}

/* require area */
if(!area){
return res.status(400).json({error:"Area required"});
}

await db.collection("escorts").updateOne(
{ email },
{
$set:{
name,
age,
gender,
phone,
area,
street
}
}
);

res.json({message:"Profile updated"});

}catch(err){
res.status(500).json({error:"Server error"});
}

});

/* ================= UPLOAD MEDIA ================= */
/* images: 1–3 */
/* videos: max 2 */

app.post("/upload-media", async (req,res)=>{

try{

const { email, images = [], videos = [] } = req.body;

if(!email){
return res.status(400).json({error:"Email required"});
}

if(images.length < 1 || images.length > 3){
return res.status(400).json({error:"1 to 3 images allowed"});
}

if(videos.length > 2){
return res.status(400).json({error:"Max 2 videos allowed"});
}

await db.collection("escorts").updateOne(
{ email },
{ $set:{ images, videos } }
);

res.json({message:"Media uploaded"});

}catch(err){
res.status(500).json({error:"Server error"});
}

});

/* ================= PUBLIC PROFILES ================= */
/* visitors see only active escorts */

app.get("/profiles", async (req,res)=>{

try{

await expireAccounts();

const escorts = await db
.collection("escorts")
.find({active:true})
.toArray();

res.json(escorts);

}catch(err){
res.status(500).json({error:"Server error"});
}

});

/* ================= TEST ROUTE ================= */

app.get("/", (req,res)=>{
res.send("API working");
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
console.log("Server running on port " + PORT);
});
