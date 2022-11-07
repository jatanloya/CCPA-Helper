const { record } = require("../models/record");
const { sendError, sendResponse } = require("../utils/responseHandler");

async function getData(req, res) {
  try {
    const company = req.params.company;
    console.log(company);
    const result = await record.findOne({
      company: company,
    });
    console.log(result);
    return sendResponse(res, result);
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = {
  getData,
};
