require("dotenv").config();
const cron = require("node-cron");
const delay = require("./services/delayInPayment");
const deleteOld = require("./services/deleteOld");

const authRouter = require("./routes/auth-router");
const tenantRouter = require("./routes/tenants-router");
const buildingRouter = require("./routes/buildings-router");
const entryRouter = require("./routes/entries-router");
const adsBoardRouter = require("./routes/ads_board-router");
const apartmentRouter = require("./routes/apartments-router");
const expenseRouter = require("./routes/expenses-router");
const expensesKindsRouter = require("./routes/expenses_kinds-router")
const cameraRouter = require("./routes/camera-router");
const tenantPaymentsRouter = require("./routes/tenant_Payments-router");
const voteRouter = require("./routes/votes-router");
const tenantVoteRouter = require("./routes/vote_of_tenant-router");
const balanceRouter = require("./routes/balance-router");
const faultsRouter = require("./routes/faults-router");
const messagesRouter = require("./routes/messages-router");
const monthesRouter = require("./routes/monthes-router");
const parksRouter = require("./routes/parks-router");
const storagesRouter = require("./routes/storages-router");
const adminsRouter = require("./routes/admin-router");
const paymentSettingsRouter = require("./routes/payment_settings-router");
const voteTypeRouter = require("./routes/vote_types-router");
const paymentFormsRouter = require("./routes/payments_forms-router");

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
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

app.use("/", authRouter);
app.use("/admin", adminsRouter);
app.use("/adsBoard", adsBoardRouter);
app.use("/apartment", apartmentRouter);
app.use("/balance", balanceRouter);
app.use("/building", buildingRouter);
app.use("/camera", cameraRouter);
app.use("/entry", entryRouter);
app.use("/expense", expenseRouter);
app.use("/expensesKind", expensesKindsRouter);
app.use("/fault", faultsRouter);
app.use("/message", messagesRouter);
app.use("/month", monthesRouter);
app.use("/park", parksRouter);
app.use("/payment", tenantPaymentsRouter);
app.use("/paymentForm", paymentFormsRouter);
app.use("/paymentSettings", paymentSettingsRouter);
app.use("/storage", storagesRouter);
app.use("/tenant", tenantRouter);
app.use("/tenantPayment", tenantPaymentsRouter);
app.use("/tenantVote", tenantVoteRouter);
app.use("/vote", voteRouter);
app.use("/voteType", voteTypeRouter);


cron.schedule("0 0 0 * * *", () => {
  deleteOld.deleteAds();
   delay.updateDebt();
   delay.weekToPay();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});