const service = require("../services/fabricService");

// GET /api/fabric/pcwt/:pono
exports.getFabricPcWt = async (req, res, next) => {
  try {
    const pono = (req.params.pono || "").trim();
    if (!pono) {
      return res.status(400).json({ success: false, message: "PO No is required" });
    }
    const data = await service.getFabricPcWt(pono);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// PUT /api/fabric/pcwt   body: { uid, pcwt }
exports.updateFabricPcWt = async (req, res, next) => {
  try {
    const { uid, pcwt } = req.body || {};
    const uidOk = /^\d+$/.test(String(uid ?? ""));
    const pcwtNum = Number(pcwt);
    if (!uidOk || pcwt === "" || pcwt === null || pcwt === undefined ||
        !Number.isFinite(pcwtNum) || pcwtNum < 0) {
      return res.status(400).json({
        success: false,
        message: "A valid fabric uid and a non-negative Pc Weight are required",
      });
    }
    const data = await service.updateFabricPcWt(String(uid), Math.round(pcwtNum * 100) / 100);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
