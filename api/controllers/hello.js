const { sendError, sendResponse } = require("../utils/responseHandler");

async function hello(req, res) {
  return sendResponse(res, "Hello World");
}

module.exports = {
  hello,
};
