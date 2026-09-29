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

async function updateFabricPcWt(pono, uid, pcwt, fabric) {
  let row;
  try {
    row = await repo.updateFabricPcWt(uid, pcwt, fabric);
  } catch (err) {
    throw wrapDbError(err);
  }

  if (!row || Number(row.ResponseCode) !== 100) {
    throw Object.assign(new Error(row?.ResponseMessage || "Failed to update Pc Weight"), { status: 409 });
  }

  // The SP reports success even on a WHERE clause that matched zero rows (no @@ROWCOUNT
  // check), so confirm the write actually landed rather than trusting ResponseCode alone.
  const after = await getFabricPcWt(pono);
  const match = after.find(r => r.fabric === fabric);
  if (!match || Number(match.pcWt) !== Number(pcwt)) {
    throw Object.assign(
      new Error("The database reported success but the value was not actually saved — please check with the manager"),
      { status: 409 }
    );
  }

  return { message: row.ResponseMessage };
}

async function getFabricData(barcode) {
  let rows;
  try {
    rows = await repo.getFabricData(barcode);
  } catch (err) {
    throw wrapDbError(err);
  }

  const first = rows[0];
  if (!first || Number(first.ResponseCode) !== 100) {
    throw Object.assign(new Error(first?.ResponseMessage || "Invalid Barcode"), { status: 404 });
  }

  return {
    fabric: first.fabric,
    colour: first.colour,
    weight: first.wt,
    rolls: first.rolls,
    location: first.location,
    pono: first.PONo,
    buyer: first.Buyer,
    party: first.party,
    docNo: first.docno,
    docDate: first.docdt,
    dcNo: first.dcno,
  };
}

async function getFabricSurplus(pono) {
  let rows;
  try {
    rows = await repo.getFabricSurplus(pono);
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
    brand: r.Brand,
    fabric: r.fabric,
    part: r.Part,
    cuttingWt: r.CuttingWeight,
    cuttingWaste: r.cuttingwaste,
    endBits: r.endbits,
    totalUsedWt: r.totalusedwt,
  }));
}

async function updateFabricSurplus(params) {
  let row;
  try {
    row = await repo.updateFabricSurplus(params);
  } catch (err) {
    throw wrapDbError(err);
  }

  if (!row || Number(row.ResponseCode) !== 100) {
    throw Object.assign(new Error(row?.ResponseMessage || "Failed to update Surplus Fabric"), { status: 409 });
  }
  return { message: row.ResponseMessage };
}

module.exports = {
  getFabricPcWt, updateFabricPcWt,
  getFabricData,
  getFabricSurplus, updateFabricSurplus,
};
