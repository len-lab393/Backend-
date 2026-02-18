const express = require("express");
const router = express.Router();
const { stkPush } = require("../mpesa");

// initiate payment
router.post("/pay", async (req,res)=>{
  const { phone, amount } = req.body;

  if(!phone || !amount)
    return res.json({error:"Missing phone or amount"});

  const result = await stkPush(phone, amount);

  res.json(result);
});

// mpesa callback
router.post("/callback",(req,res)=>{
  console.log("MPESA CALLBACK:", JSON.stringify(req.body,null,2));

  // here you unlock subscription, save payment, etc

  res.json({ResultCode:0,ResultDesc:"Accepted"});
});

module.exports = router;
