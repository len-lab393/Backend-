const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("BACKEND LIVE 🚀");
});

// test API route
app.get("/api/test", (req, res) => {
  res.json({ message: "API working" });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
