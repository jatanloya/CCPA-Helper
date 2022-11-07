const path = require("path");
require("dotenv").config({ path: path.resolve("../.env") });
// require('dotenv').config({ path:'/home/ubuntu/KMC-Neuro-ARS/.env' });

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const db = require("./config/mongo");
const routes = require("./routes/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connectMongo();

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

async function shutDown() {
  console.log("Received kill signal, shutting down gracefully");
  await db.disconnectMongo();
  console.log("Server Shutdown");
  process.exit(0);
}
