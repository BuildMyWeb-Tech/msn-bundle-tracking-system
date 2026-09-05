const repo = require("../repositories/bundleRepo");

// mssql/tedious error codes for connection-level failures (not bad data)
const CONNECTION_ERROR_CODES = new Set([
  "ETIMEOUT", "ESOCKET", "ECONNCLOSED", "ECONNRESET", "ELOGIN", "EREQUEST",
]);

function wrapDbError(err) {
  if (CONNECTION_ERROR_CODES.has(err.code) || /timeout|connect/i.test(err.message)) {
    return Object.assign(
      new Error("Database temporarily unavailable — please try again in a moment"),
      { status: 503 }
    );
  }
  return err;
}

async function getPono(pono) {
  let rows;
  try {
    rows = await repo.getPonoList();
  } catch (err) {
    throw wrapDbError(err);
  }

  const target = String(pono).trim().toLowerCase();
  const match = rows.find(r => String(r.Pono ?? "").trim().toLowerCase() === target);
  if (!match) {
    throw Object.assign(new Error("PO No not found"), { status: 404 });
  }
  return match;
}

async function getPonoProcess(pono) {
  try {
    return await repo.getPonoProcess(pono);
  } catch (err) {
    throw wrapDbError(err);
  }
}

module.exports = { getPono, getPonoProcess };
