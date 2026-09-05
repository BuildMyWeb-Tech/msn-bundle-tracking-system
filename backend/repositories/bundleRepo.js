const { getPool, sql } = require("../database/sqlConnection");

async function getPonoList() {
  const pool = await getPool();
  const result = await pool.request().execute("PR_App_GetPono");
  return result.recordset || [];
}

async function getPonoProcess(pono) {
  const pool = await getPool();
  const result = await pool.request()
    .input("pono", sql.NVarChar(30), String(pono))
    .execute("PR_App_GetPonoProcess");
  return result.recordset || [];
}

module.exports = { getPonoList, getPonoProcess };
