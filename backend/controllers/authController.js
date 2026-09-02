const service = require("../services/authService");

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { username, password, companyCode } = req.body || {};
    if (!username || !password || !companyCode) {
      return res.status(400).json({
        success: false,
        message: "Company code, username and password are required",
      });
    }
    const data = await service.login({
      username,
      password,
      companyCode: String(companyCode),
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
