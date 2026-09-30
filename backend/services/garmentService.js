const repo = require("../repositories/garmentRepo");

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

async function getGarmentSurplus(pono) {
  let rows;
  try {
    rows = await repo.getGarmentSurplus(pono);
  } catch (err) {
    throw wrapDbError(err);
  }

  const first = rows[0];
  if (!first || Number(first.ResponseCode) !== 100) {
    throw Object.assign(new Error(first?.ResponseMessage || "Invalid Po No"), { status: 404 });
  }

  return rows.map(r => ({
    uid: r.uid,
    pono: r.orderno,
    brand: r.Brand,
    styleCode: r.StyleCode,
    colour: r.Colour,
    surplusQty: r.surplusQty,
  }));
}

async function updateGarmentSurplus(uid, sqty) {
  let row;
  try {
    row = await repo.updateGarmentSurplus(uid, sqty);
  } catch (err) {
    throw wrapDbError(err);
  }

  if (!row || Number(row.ResponseCode) !== 100) {
    throw Object.assign(new Error(row?.ResponseMessage || "Failed to update Surplus Qty"), { status: 409 });
  }
  return { message: row.ResponseMessage };
}

module.exports = { getGarmentSurplus, updateGarmentSurplus };
