const repo = require("../repositories/authRepo");
const jwt  = require("jsonwebtoken");

const JWT_SECRET  = process.env.JWT_SECRET  || "bts-secret-change-me";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "8h";

// mssql/tedious error codes for connection-level failures (not bad credentials)
const CONNECTION_ERROR_CODES = new Set([
  "ETIMEOUT", "ESOCKET", "ECONNCLOSED", "ECONNRESET", "ELOGIN", "EREQUEST",
]);

async function login({ username, password, companyCode }) {
  let rows;
  try {
    rows = await repo.validateUserLogin({ username, password, companyCode });
  } catch (err) {
    if (CONNECTION_ERROR_CODES.has(err.code) || /timeout|connect/i.test(err.message)) {
      throw Object.assign(
        new Error("Database temporarily unavailable — please try again in a moment"),
        { status: 503 }
      );
    }
    throw err; // unknown error — let it bubble up as a 500
  }

  if (!rows.length) {
    throw Object.assign(new Error("Invalid Username or Password"), { status: 401 });
  }

  const first = rows[0];
  const responseCode = Number(first.ResponseCode ?? first.responsecode);

  if (responseCode !== 100) {
    throw Object.assign(
      new Error(first.ResponseMessage ?? first.responsemessage ?? "Invalid Username or Password"),
      { status: 401 }
    );
  }

  const userId = Number(first.Userid ?? first.userid ?? 0);

  const menus = rows
    .filter(r => r.MenuName ?? r.menuname)
    .map(r => ({
      menuName:  r.MenuName ?? r.menuname,
      formName:  r.FormName ?? r.formname,
      menuOrder: Number(r.MenuOrder ?? r.menuorder) || 0,
    }))
    .sort((a, b) => a.menuOrder - b.menuOrder);

  const token = jwt.sign({ userId, loginType: "mobile" }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  return { token, userId, userName: username, menus };
}

module.exports = { login };