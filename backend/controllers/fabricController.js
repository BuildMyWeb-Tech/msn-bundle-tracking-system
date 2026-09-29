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

// PUT /api/fabric/pcwt   body: { pono, uid, pcwt, fabric }
exports.updateFabricPcWt = async (req, res, next) => {
  try {
    const { pono, uid, pcwt, fabric } = req.body || {};
    const uidOk = /^\d+$/.test(String(uid ?? ""));
    const pcwtNum = Number(pcwt);
    if (!pono || !uidOk || !fabric || pcwt === "" || pcwt === null || pcwt === undefined ||
        !Number.isFinite(pcwtNum) || pcwtNum < 0) {
      return res.status(400).json({
        success: false,
        message: "A valid PO No, fabric uid, fabric name and a non-negative Pc Weight are required",
      });
    }
    const data = await service.updateFabricPcWt(
      String(pono), String(uid), Math.round(pcwtNum * 100) / 100, String(fabric)
    );
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// GET /api/fabric/data/:barcode
exports.getFabricData = async (req, res, next) => {
  try {
    const barcode = (req.params.barcode || "").trim();
    if (!barcode) {
      return res.status(400).json({ success: false, message: "Barcode is required" });
    }
    const data = await service.getFabricData(barcode);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// GET /api/fabric/surplus/:pono
exports.getFabricSurplus = async (req, res, next) => {
  try {
    const pono = (req.params.pono || "").trim();
    if (!pono) {
      return res.status(400).json({ success: false, message: "PO No is required" });
    }
    const data = await service.getFabricSurplus(pono);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// PUT /api/fabric/surplus   body: { uid, fabric, cuttingwt, cuttingwaste, endbits, tusedwt }
exports.updateFabricSurplus = async (req, res, next) => {
  try {
    const { uid, fabric, cuttingwt, cuttingwaste, endbits, tusedwt } = req.body || {};
    const uidOk = /^\d+$/.test(String(uid ?? ""));
    const nums = [cuttingwt, cuttingwaste, endbits, tusedwt].map(Number);
    const numsOk = nums.every(n => Number.isFinite(n) && n >= 0);
    if (!uidOk || !fabric || !numsOk) {
      return res.status(400).json({
        success: false,
        message: "A valid PO uid, fabric name, and non-negative weight values are required",
      });
    }
    const [cuttingwtN, cuttingwasteN, endbitsN, tusedwtN] = nums.map(n => Math.round(n * 100) / 100);
    const data = await service.updateFabricSurplus({
      uid: String(uid), fabric: String(fabric),
      cuttingwt: cuttingwtN, cuttingwaste: cuttingwasteN, endbits: endbitsN, tusedwt: tusedwtN,
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
