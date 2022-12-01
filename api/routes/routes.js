const router = require("express").Router();
const controller = require("../controllers/index");

//*Test Route
router.get("/", controller.populate);

//* Get Data Route
router.get("/data", controller.getData);

module.exports = router;
