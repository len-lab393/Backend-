const fs = require("fs")

module.exports = (app)=>{

// =======================
// VIEW APPROVED ESCORTS LIST
// =======================
app.get("/escorts",(req,res)=>{

let escorts = JSON.parse(fs.readFileSync("database.json"))

let approved = escorts.filter(e => e.approved === true)

let html = approved.map(e=>`
<div style="border:1px solid #000;padding:10px;margin:10px">
<h3>${e.name}</h3>
<p>${e.location}</p>
<a href="/escort/${e.id}">View Profile</a>
</div>
`).join("")

res.send(html)

})


// =======================
// SINGLE ESCORT PROFILE PAGE
// =======================
app.get("/escort/:id",(req,res)=>{

let escorts = JSON.parse(fs.readFileSync("database.json"))

let escort = escorts.find(e=>e.id == req.params.id)

if(!escort) return res.send("Escort not found")

res.send(`
<h1>${escort.name}</h1>
<p>${escort.location}</p>

<h3>Contact Locked 🔒</h3>
<p>Pay to unlock contact</p>
`)

})

  }
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// escort registration
router.post("/register", upload.single("photo"), (req, res) => {

  const { name, price, phone } = req.body;
  const image = req.file.filename;

  const page = `
  <html>
  <body>
  <h1>${name}</h1>
  <img src="/uploads/${image}" width="300"/>
  <p>Price: ${price}</p>

  <button onclick="unlock('${phone}')">Unlock Contact</button>

  <script>
  function unlock(phone){
    window.location = "/payment.html?phone=" + phone;
  }
  </script>
  </body>
  </html>
  `;

  fs.writeFileSync(`public/escorts/${name}.html`, page);

  res.json({
    message: "Profile submitted for approval"
  });
});

module.exports = router;
