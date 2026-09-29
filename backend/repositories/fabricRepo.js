const { getPool, sql } = require("../database/sqlConnection");

async function getFabricPcWt(pono) {
  const pool = await getPool();
  const result = await pool.request()
    .input("Pono", sql.NVarChar(50), String(pono))
    .execute("PR_App_getfabric_pcwt");
  return result.recordset || [];
}

async function updateFabricPcWt(uid, pcwt, fabric) {
  const pool = await getPool();
  const result = await pool.request()
    .input("Uid", sql.BigInt, uid)
    .input("pcwt", sql.Float, pcwt)
    .input("Fabric", sql.NVarChar(200), String(fabric))
    .execute("PR_App_Update_FabricPcWt");
  return result.recordset?.[0] || null;
}

async function getFabricData(barcode) {
  const pool = await getPool();
  const result = await pool.request()
    .input("Barcode", sql.NVarChar(50), String(barcode))
    .execute("PR_App_Get_FabricData");
  return result.recordset || [];
}

async function getFabricSurplus(pono) {
  const pool = await getPool();
  const result = await pool.request()
    .input("Pono", sql.NVarChar(50), String(pono))
    .execute("PR_App_getfabric_surplus");
  return result.recordset || [];
}

async function updateFabricSurplus({ uid, fabric, cuttingwt, cuttingwaste, endbits, tusedwt }) {
  const pool = await getPool();
  const result = await pool.request()
    .input("Uid", sql.BigInt, uid)
    .input("Fabric", sql.NVarChar(200), String(fabric))
    .input("cuttingwt", sql.Float, cuttingwt)
    .input("cuttingwaste", sql.Float, cuttingwaste)
    .input("endbits", sql.Float, endbits)
    .input("Tusedwt", sql.Float, tusedwt)
    .execute("PR_App_Update_fabric_surplus");
  return result.recordset?.[0] || null;
}

module.exports = {
  getFabricPcWt, updateFabricPcWt,
  getFabricData,
  getFabricSurplus, updateFabricSurplus,
};
