const { getPool, sql } = require("../database/sqlConnection");

async function getGarmentSurplus(pono) {
  const pool = await getPool();
  const result = await pool.request()
    .input("Pono", sql.NVarChar(50), String(pono))
    .execute("PR_App_getGarment_surplus");
  return result.recordset || [];
}

async function updateGarmentSurplus(uid, sqty) {
  const pool = await getPool();
  const result = await pool.request()
    .input("Uid", sql.BigInt, uid)
    .input("sqty", sql.Int, sqty)
    .execute("PR_App_Update_GarmentSurplus");
  return result.recordset?.[0] || null;
}

module.exports = { getGarmentSurplus, updateGarmentSurplus };
