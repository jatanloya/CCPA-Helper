const mongoose = require("mongoose");

//* Defining a Right Schema
const rightSchema = new mongoose.Schema({
  exists: {
    type: Boolean,
    required: true,
  },
  mechanism: {
    type: String,
  },
  url: {
    type: String,
  },
  logo: {
    type: Boolean,
    default: false,
  },
});
//* Defining a single Record Schema
const recordSchema = new mongoose.Schema({
  comapny: {
    required: true,
    type: String,
  },
  mainURL: {
    required: true,
    type: String,
  },
  dateOfPolicy: {
    required: true,
    type: Date,
  },
  policyURL: {
    type: String,
  },
  CCPA: {
    required: true,
    type: Boolean,
  },
  clicks: {
    required: true,
    type: Number,
  },
  //* Embedding Right Schema in Record Schema
  rtk: {
    type: rightSchema,
  },
  rtd: {
    type: rightSchema,
  },
  rto: {
    type: rightSchema,
  },
});

const right = mongoose.model("rights", rightSchema);
const record = mongoose.model("records", recordSchema);
module.exports = {
  record,
  right,
};
