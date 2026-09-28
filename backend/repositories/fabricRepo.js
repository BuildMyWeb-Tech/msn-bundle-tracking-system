const { getPool, sql } = require("../database/sqlConnection");

async function getFabricPcWt(pono) {
  const pool = await getPool();
  const result = await pool.request()
    .input("Pono", sql.NVarChar(50), String(pono))
    .execute("PR_App_getfabric_pcwt");
  return result.recordset || [];
}

async function updateFabricPcWt(uid, pcwt) {
  const pool = await getPool();
  const result = await pool.request()
    .input("Uid", sql.BigInt, uid)
    .input("pcwt", sql.Float, pcwt)
    .execute("PR_App_Update_FabricPcWt");
  return result.recordset?.[0] || null;
}

module.exports = { getFabricPcWt, updateFabricPcWt };
