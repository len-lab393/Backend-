const express = require("express");
const router = express.Router();

router.get("/check-access/:phone", (req, res) => {
  res.json({ success: true });
});

module.exports = router;
