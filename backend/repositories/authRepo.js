const { getPool, sql } = require("../database/sqlConnection");

async function validateUserLogin({ username, password, companyCode }) {
  const pool = await getPool();
  const result = await pool.request()
    .input("UserName",    sql.NVarChar(50),  String(username))
    .input("Password",    sql.NVarChar(50),  String(password))
    .input("companycode", sql.NVarChar(100), String(companyCode))
    .execute("PR_AppValidate_UserLogin");

  // TEMP DEBUG — remove once login is confirmed stable
  console.log("[PR_AppValidate_UserLogin] rows:", JSON.stringify(result.recordset, null, 2));

  return result.recordset || [];
}

module.exports = { validateUserLogin };