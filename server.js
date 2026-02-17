require("dotenv").config();
const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/payment");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/payment", paymentRoutes);

app.get("/", (req,res)=>{
  res.send("Backend running");
});

app.listen(process.env.PORT || 5000, ()=>{
  console.log("Server running");
});
