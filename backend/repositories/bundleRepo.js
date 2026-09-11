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

async function issueBundle({ uid, date, pono, processid, partyid, barcode }) {
  const pool = await getPool();
  const result = await pool.request()
    .input("uid", sql.BigInt, uid)
    .input("Date", sql.Date, date)
    .input("PoNo", sql.NVarChar(40), String(pono))
    .input("Processid", sql.Int, Number(processid))
    .input("Partyid", sql.Int, Number(partyid))
    .input("Barcode", sql.NVarChar(sql.MAX), String(barcode))
    .execute("PR_IUD_Bundle_Issue");
  return result.recordset?.[0] || null;
}

module.exports = { getPonoList, getPonoProcess, getIssuedGrid, issueBundle };
