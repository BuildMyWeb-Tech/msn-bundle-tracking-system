const service = require("../services/bundleService");

// GET /api/bundle/pono/:pono
exports.getPono = async (req, res, next) => {
  try {
    const pono = (req.params.pono || "").trim();
    if (!pono) {
      return res.status(400).json({ success: false, message: "PO No is required" });
    }
    const data = await service.getPono(pono);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// GET /api/bundle/pono-process/:pono
exports.getPonoProcess = async (req, res, next) => {
  try {
    const pono = (req.params.pono || "").trim();
    if (!pono) {
      return res.status(400).json({ success: false, message: "PO No is required" });
    }
    const data = await service.getPonoProcess(pono);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
