const router = require("express").Router();
const ctrl = require("../controllers/fabricController");

router.get("/pcwt/:pono", ctrl.getFabricPcWt);
router.put("/pcwt", ctrl.updateFabricPcWt);
router.get("/data/:barcode", ctrl.getFabricData);
router.get("/surplus/:pono", ctrl.getFabricSurplus);
router.put("/surplus", ctrl.updateFabricSurplus);

module.exports = router;
