require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { validateEnv } = require("./config/env");
const { connectMongo, disconnectMongo } = require("./config/mongo");
const app = require("./app");

const port = process.env.PORT || 8000;

async function start() {
  validateEnv();
  await connectMongo();
  app.listen(port, () => console.log(`Listening on ${port}`));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

async function shutDown() {
  console.log("Received kill signal, shutting down gracefully");
  await disconnectMongo();
  process.exit(0);
}
