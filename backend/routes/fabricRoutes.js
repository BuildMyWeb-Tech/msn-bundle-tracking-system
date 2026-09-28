const router = require("express").Router();
const ctrl = require("../controllers/fabricController");

router.get("/pcwt/:pono", ctrl.getFabricPcWt);
router.put("/pcwt", ctrl.updateFabricPcWt);

module.exports = router;
