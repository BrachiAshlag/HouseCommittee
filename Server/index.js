require("dotenv").config();
const cron = require("node-cron");
const delay = require("./services/delayInPayment");
const deleteOld = require("./services/deleteOld");

const authRouter = require("./routes/auth-router");
const tenantRouter = require("./routes/tenants-router");
const buildingRouter = require("./routes/buildings-router");
const entryRouter = require("./routes/entries-router");
const Ads_boardRouter = require("./routes/ads_board-router");
const apartmentRouter = require("./routes/apartments-router");
const expenseRouter = require("./routes/expenses-router");
const expensesKindsRouter = require("./routes/expenses_kinds-router")
const parkingPremitRouter = require("./routes/parking_premits-router");
const tenantPaymentsRouter = require("./routes/tenant_Payments-router");
const voteRouter = require("./routes/votes-router");
const tenantVoteRouter = require("./routes/vote_of_tenant-router");
const balanceRouter = require("./routes/balance-router");
const faultsRouter = require("./routes/faults-router");
const monthesRouter = require("./routes/monthes-router");
const parksRouter = require("./routes/parks-router");
const storagesRouter = require("./routes/storages-router");
const adminsRouter = require("./routes/admin-router");
const paymentSettingsRouter = require("./routes/payment_settings-router");
const voteTypeRouter = require("./routes/vote_types-router");

const express = require("express");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = require("./models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to our application." });
});

app.use("/auth", authRouter);
app.use("/tenant", tenantRouter);
app.use("/apartment", apartmentRouter);
app.use("/payment", tenantPaymentsRouter);
app.use("/building", buildingRouter);
app.use("/entry", entryRouter);
app.use("/adsBoard", Ads_boardRouter);
app.use("/parkingPremit", parkingPremitRouter);
app.use("/tenantPayment", tenantPaymentsRouter);
app.use("/expensesKind", expensesKindsRouter);
app.use("/expense", expenseRouter);
app.use("/vote", voteRouter);
app.use("/tenantVote", tenantVoteRouter);
app.use("/balance", balanceRouter);
app.use("/fault", faultsRouter);
app.use("/month", monthesRouter);
app.use("/park", parksRouter);
app.use("/storage", storagesRouter);
app.use("/admin", adminsRouter);
app.use("/paymentSettings", paymentSettingsRouter);
app.use("/voteTypes", voteTypeRouter);

// cron.schedule("0 0 0 * * *", () => {
cron.schedule("15 5 * * * *", () => {
  console.log(new Date());
  // deleteOld.deleteAds();
   delay.updateDebt();
  //  delay.weekToPay();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});