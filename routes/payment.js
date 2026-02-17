const express = require("express");
const router = express.Router();
const { simulatePayment } = require("../mpesa");

router.post("/pay", async (req,res)=>{
  const { phone, amount } = req.body;

  if(!phone || !amount)
    return res.json({error:"Missing details"});

  const result = await simulatePayment(phone, amount);

  if(result.success){
    return res.json({
      paid:true,
      unlockContact:true
    });
  }

  res.json({paid:false});
});

module.exports = router;
