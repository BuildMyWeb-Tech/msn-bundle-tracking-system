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

async function getIssuedGrid(pono, processuid) {
  const pool = await getPool();
  const result = await pool.request()
    .input("pono", sql.NVarChar(sql.MAX), String(pono))
    .input("processuid", sql.Int, Number(processuid))
    .execute("PR_App_Bundle_Issued_LoadGrid");
  return result.recordset || [];
}

module.exports = { getPonoList, getPonoProcess, getIssuedGrid };
