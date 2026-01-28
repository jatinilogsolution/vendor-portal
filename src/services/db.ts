import { ConnectionPool } from "mssql";

const config = {
  user: process.env.DB_USER_NAME || "app_dbadmin",
  password: process.env.DB_PASSWORD || "#@)#n%^$4?#?$",
  server: process.env.DB_HOST || "182.76.62.178",
  database: process.env.DB_1 || "NEWAWLDB",
  port: 1433,
  options: {
    trustServerCertificate: true,
    encrypt: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Global singleton promise
const globalForMssql = globalThis as unknown as {
  mssqlPoolPromise: Promise<ConnectionPool> | null;
  mssqlPoolPromiseFins: Promise<ConnectionPool> | null;
};

let poolPromise: Promise<ConnectionPool> | null =
  globalForMssql.mssqlPoolPromise;

export const getAWLWMSDBPOOL = async (): Promise<ConnectionPool> => {
  if (poolPromise) {
    try {
      const pool = await poolPromise;
      if (pool.connected) {
        return pool;
      }
      console.warn("⚠️ MSSQL pool disconnected. Reconnecting...");
    } catch (err) {
      console.warn("⚠️ MSSQL pool error. Reconnecting...");
    }
  }

  // Create and cache new connection
  const newPool = new ConnectionPool(config);

  poolPromise = newPool
    .connect()
    .then((pool) => {
      console.log("✅ MSSQL Pool connected successfully");

      // Listen for errors
      pool.on("error", (err) => {
        console.error("❌ MSSQL Pool Error:", err);
        globalForMssql.mssqlPoolPromise = null; // Reset on fatal error
      });

      return pool;
    })
    .catch((err) => {
      console.error("❌ Failed to connect MSSQL pool:", err);
      globalForMssql.mssqlPoolPromise = null;
      throw err;
    });

  // Cache globally
  globalForMssql.mssqlPoolPromise = poolPromise;

  return poolPromise;
};

const config2 = {
  user: process.env.DB_USER_NAME_2 || "app_dbadmin",
  password: process.env.DB_PASSWORD_2 || "#@)#n%^$4?#?$",
  server: process.env.DB_HOST_2 || "182.76.62.178",
  database: process.env.DB_2 || "AWLFINS",
  port: 1433,
  requestTimeout: 60000,
  connectionTimeout: 30000,
  options: {
    trustServerCertificate: true,
    encrypt: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromiseFins: Promise<ConnectionPool> | null =
  globalForMssql.mssqlPoolPromiseFins;

export const getAWLWMSDBPOOLFINS = async (): Promise<ConnectionPool> => {
  if (poolPromiseFins) {
    try {
      const pool = await poolPromiseFins;
      if (pool.connected) {
        return pool;
      }
      console.warn("⚠️ MSSQL pool disconnected. Reconnecting...");
    } catch (err) {
      console.warn("⚠️ MSSQL pool error. Reconnecting...");
    }
  }

  // Create and cache new connection
  const newPool = new ConnectionPool(config2);

  poolPromiseFins = newPool
    .connect()
    .then((pool) => {
      console.log("✅ MSSQL FINS Pool connected successfully");

      // Listen for errors
      pool.on("error", (err) => {
        console.error("❌ MSSQL Pool Error:", err);
        globalForMssql.mssqlPoolPromiseFins = null; // Reset on fatal error
      });

      return pool;
    })
    .catch((err) => {
      console.error("❌ Failed to connect MSSQL pool:", err);
      globalForMssql.mssqlPoolPromiseFins = null;
      throw err;
    });

  // Cache globally
  globalForMssql.mssqlPoolPromiseFins = poolPromiseFins;

  return poolPromiseFins;
};
