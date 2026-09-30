const router = require("express").Router();
const ctrl = require("../controllers/garmentController");

router.get("/surplus/:pono", ctrl.getGarmentSurplus);
router.put("/surplus", ctrl.updateGarmentSurplus);

module.exports = router;
