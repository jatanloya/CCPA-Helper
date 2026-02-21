const { record: Record } = require("../models/record");
const AppError = require("../utils/AppError");

async function getRecords(req, res, next) {
  try {
    const { url, company, page, limit } = req.query;
    const filter = {};
    if (url) filter.mainURL = url;
    if (company) filter.company = new RegExp(company, "i");

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
    const { q, page = 1, limit = 20 } = req.query;
    if (!q) throw new AppError("Query parameter 'q' is required", 400);

    const filter = { $text: { $search: q } };
    const skip = (Number(page) - 1) * Number(limit);

    const [records, total] = await Promise.all([
      Record.find(filter, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(Number(limit)),
      Record.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: records,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
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
