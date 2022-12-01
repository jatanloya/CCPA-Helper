const { record } = require("../models/record");
const { sendError, sendResponse } = require("../utils/responseHandler");

async function getData(req, res) {
  try {
    const mainURL = req.query.url;
    // console.log(mainURL);
    const result = await record.findOne({
      mainURL: mainURL,
    });
    // console.log(result);
    return sendResponse(res, result);
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = {
  getData,
};
