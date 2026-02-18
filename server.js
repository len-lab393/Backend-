const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// LOGIN ROUTE
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log("Username:", username);
  console.log("Password:", password);

  // TEMP LOGIN
  if (username === "admin" && password === "1234") {
    
    // redirect to dashboard
    return res.redirect(
      "https://junioremperor54-tech.github.io/UK-Worldwide-escorts/dashboard.html"
    );

  } else {
    res.send("Invalid username or password");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
