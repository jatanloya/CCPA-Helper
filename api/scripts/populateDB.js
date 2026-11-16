const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const { record } = require("../models/record");

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI environment variable is not set");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const sampleRecord = {
    company: "Twitter",
    mainURL: "https://twitter.com/",
    dateOfPolicy: new Date(),
    policyURL: "https://twitter.com/en/privacy",
    CCPA: true,
    clicks: 2,
    rtk: {
      exists: true,
      mechanism: "Form",
      url: "https://help.twitter.com/en/forms/privacy",
    },
    rtd: {
      exists: true,
      mechanism: "Manual",
      url: "https://help.twitter.com/en/managing-your-account/how-to-deactivate-twitter-account",
    },
    rto: {
      exists: true,
      mechanism: "Manual",
      url: "https://optout.aboutads.info/",
      logo: true,
    },
  };

  const result = await record.create(sampleRecord);
  console.log("Seeded record:", result.company);

  await mongoose.connection.close();
  console.log("Done");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
