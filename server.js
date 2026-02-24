const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// health check route
app.get("/", (req, res) => {
  res.send("BACKEND WORKING 🚀");
});

// prevent crash from unknown errors
process.on("uncaughtException", err => {
  console.error("CRASH:", err);
});

process.on("unhandledRejection", err => {
  console.error("PROMISE ERROR:", err);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
