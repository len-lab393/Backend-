const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// read form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// TEST ROUTE (check backend running)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// LOGIN ROUTE
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt:", username, password);

  // TEMP FAKE LOGIN (we add database later)
  if (username === "admin" && password === "1234") {
    res.send("Login successful");
    // later we redirect to dashboard
    // res.redirect("https://yourfrontend.com/dashboard.html");
  } else {
    res.send("Invalid username or password");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
