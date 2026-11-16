const { record: Record } = require("../models/record");
const AppError = require("../utils/AppError");

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getRecords(req, res, next) {
  try {
    const { url, company, page, limit } = req.query;
    const filter = {};
    if (url) filter.mainURL = url;
    if (company) filter.company = new RegExp(escapeRegex(company), "i");

    const [records, total] = await Promise.all([
      Record.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ company: 1 }),
      Record.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getRecordById(req, res, next) {
  try {
    const doc = await Record.findById(req.params.id);
    if (!doc) throw new AppError("Record not found", 404);
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
}

async function createRecord(req, res, next) {
  try {
    const doc = await Record.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
}

async function updateRecord(req, res, next) {
  try {
    const doc = await Record.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!doc) throw new AppError("Record not found", 404);
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
}

async function deleteRecord(req, res, next) {
  try {
    const doc = await Record.findByIdAndDelete(req.params.id);
    if (!doc) throw new AppError("Record not found", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function searchRecords(req, res, next) {
  try {
    const { q, page, limit } = req.query;
    const filter = { $text: { $search: q } };

    const [records, total] = await Promise.all([
      Record.find(filter, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip((page - 1) * limit)
        .limit(limit),
      Record.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: records,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  searchRecords,
};
