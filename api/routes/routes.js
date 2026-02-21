const router = require("express").Router();
const mongoose = require("mongoose");
const controller = require("../controllers/record.controller");
const validate = require("../middleware/validate");
const {
  createRecordSchema,
  updateRecordSchema,
  querySchema,
} = require("../validators/record.validators");

// Health check
router.get("/health", (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.status(dbState === 1 ? 200 : 503).json({
    success: true,
    data: {
      status: dbState === 1 ? "healthy" : "unhealthy",
      database: states[dbState] || "unknown",
      uptime: process.uptime(),
    },
  });
});

// Record CRUD
router.get("/records", validate(querySchema, "query"), controller.getRecords);
router.get("/records/search", controller.searchRecords);
router.get("/records/:id", controller.getRecordById);
router.post(
  "/records",
  validate(createRecordSchema, "body"),
  controller.createRecord
);
router.put(
  "/records/:id",
  validate(updateRecordSchema, "body"),
  controller.updateRecord
);
router.delete("/records/:id", controller.deleteRecord);

// Backward-compatible endpoint
router.get("/data", validate(querySchema, "query"), (req, res, next) => {
  req.query.page = 1;
  req.query.limit = 1;
  controller.getRecords(req, res, next);
});

module.exports = router;
