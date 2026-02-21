const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// routes
require("./routes/register")(app)
require("./routes/escorts")(app)
require("./routes/admin")(app)

app.listen(3000, ()=>{
console.log("Server running on port 3000")
})
