const repo = require("../repositories/fabricRepo");

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

async function getFabricPcWt(pono) {
  let rows;
  try {
    rows = await repo.getFabricPcWt(pono);
  } catch (err) {
    throw wrapDbError(err);
  }

  const first = rows[0];
  if (!first || Number(first.ResponseCode) !== 100) {
    throw Object.assign(new Error(first?.ResponseMessage || "Invalid Po No"), { status: 404 });
  }

  return rows.map(r => ({
    uid: r.uid,
    pono: r.pono,
    fabric: r.fabric,
    lotNo: r.lotno,
    fabricWeight: r.fabricweight,
    rolls: r.Rolls,
    pcWt: r.pcwtapp,
  }));
}

async function updateFabricPcWt(uid, pcwt) {
  let row;
  try {
    row = await repo.updateFabricPcWt(uid, pcwt);
  } catch (err) {
    throw wrapDbError(err);
  }

  if (!row || Number(row.ResponseCode) !== 100) {
    throw Object.assign(new Error(row?.ResponseMessage || "Failed to update Pc Weight"), { status: 409 });
  }
  return { message: row.ResponseMessage };
}

module.exports = { getFabricPcWt, updateFabricPcWt };
