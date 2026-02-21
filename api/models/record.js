const mongoose = require("mongoose");

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
  },
});

const recordSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      index: true,
    },
    mainURL: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfPolicy: {
      type: Date,
      required: true,
    },
    policyURL: {
      type: String,
    },
    CCPA: {
      type: Boolean,
      required: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    rtk: {
      type: rightSchema,
    },
    rtd: {
      type: rightSchema,
    },
    rto: {
      type: rightSchema,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

recordSchema.index({ company: "text", mainURL: "text" });

const record = mongoose.model("records", recordSchema);

module.exports = { record };
