const mongoose = require("mongoose");

async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is not set");
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}

async function disconnectMongo() {
  await mongoose.connection.close();
  console.log("DB connection terminated");
}

module.exports = { connectMongo, disconnectMongo };
