const router = require("express").Router();
const controller = require("../controllers/index");

//* Auth Routes
router.get("/", controller.hello);

module.exports = router;
