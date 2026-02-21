const fs = require("fs");

module.exports = (app) => {

  // payment plans
  const plans = {
    daily: { amount: 150, days: 2 },
    weekly: { amount: 400, days: 7 },
    monthly: { amount: 1200, days: 30 }
  };

  // request payment (SIMULATED FOR NOW)
  app.post("/pay/:id", (req, res) => {
    try {
      const escorts = JSON.parse(fs.readFileSync("database.json"));
      const escort = escorts.find(e => e.id == req.params.id);

      if (!escort) {
        return res.status(404).send("Escort not found");
      }

      const plan = req.body.plan;

      if (!plans[plan]) {
        return res.status(400).send("Invalid plan");
      }

      escort.paid = true;
      escort.approved = true;
      escort.plan = plan;
      escort.expiry =
        Date.now() + plans[plan].days * 24 * 60 * 60 * 1000;

      fs.writeFileSync("database.json", JSON.stringify(escorts, null, 2));

      res.send("Payment successful. Profile activated.");
    } catch (err) {
      console.error(err);
      res.status(500).send("Payment error");
    }
  });

};
