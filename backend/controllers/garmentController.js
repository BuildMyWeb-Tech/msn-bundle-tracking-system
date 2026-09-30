const service = require("../services/garmentService");

// GET /api/garment/surplus/:pono
exports.getGarmentSurplus = async (req, res, next) => {
  try {
    const pono = (req.params.pono || "").trim();
    if (!pono) {
      return res.status(400).json({ success: false, message: "PO No is required" });
    }
    const data = await service.getGarmentSurplus(pono);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// PUT /api/garment/surplus   body: { uid, sqty }
exports.updateGarmentSurplus = async (req, res, next) => {
  try {
    const { uid, sqty } = req.body || {};
    const uidOk = /^\d+$/.test(String(uid ?? ""));
    const sqtyNum = Number(sqty);
    if (!uidOk || sqty === "" || sqty === null || sqty === undefined ||
        !Number.isInteger(sqtyNum) || sqtyNum < 0) {
      return res.status(400).json({
        success: false,
        message: "A valid garment uid and a non-negative whole-number Surplus Qty are required",
      });
    }
    const data = await service.updateGarmentSurplus(String(uid), sqtyNum);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
