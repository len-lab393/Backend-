const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// routes
require("./routes/register")(app)
require("./routes/escorts")(app)
require("./routes/admin")(app)
require("./routes/payment")(app)

// railway port
const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
console.log("Server running on port " + PORT)
})
app.use("/escort", require("./routes/escort"));
app.use("/uploads", express.static("uploads"));
