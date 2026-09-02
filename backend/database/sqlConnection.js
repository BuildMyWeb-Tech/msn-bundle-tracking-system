const sql = require("mssql");

const config = {
  user:     process.env.DB_USER     || "msnadmin",
  password: process.env.DB_PASSWORD || "",
  server:   process.env.DB_HOST     || "108.181.197.190",
  port:     Number(process.env.DB_PORT) || 19649,
  database: process.env.DB_NAME     || "LandMark",
  options: {
    encrypt:                false,
    trustServerCertificate: true,
    enableArithAbort:       true,
    connectTimeout:         45000,
    requestTimeout:         90000,
  },
  pool: {
    max:                  10,
    min:                  2,
    idleTimeoutMillis:    30000,
    acquireTimeoutMillis: 45000,
  },
};

let pool = null;
let connecting = null;

// Lazily connects, and — critically — retries on the NEXT call instead of
// crashing the whole server if a connection attempt fails.
function getPool() {
  if (pool?.connected) return Promise.resolve(pool);

  if (!connecting) {
    pool = new sql.ConnectionPool(config);

    pool.on("error", err => {
      console.error("⚠️  SQL pool error:", err.message);
      connecting = null; // force a fresh connect attempt next time
    });

    connecting = pool.connect()
      .then(p => {
        console.log("✅ MS SQL Server connected →", config.database, "DB");
        return p;
      })
      .catch(err => {
        console.error("❌ DB connection failed:", err.message);
        connecting = null; // allow retry on the next request
        throw err;         // propagate the real error to the caller
      });
  }

  return connecting;
}

module.exports = { sql, getPool };