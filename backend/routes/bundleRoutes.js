const router = require("express").Router();
const ctrl = require("../controllers/bundleController");

router.get("/pono/:pono", ctrl.getPono);
router.get("/pono-process/:pono", ctrl.getPonoProcess);

module.exports = router;
