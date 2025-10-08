import { ConnectionPool } from "mssql";

const config1 = {
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

let pool1: ConnectionPool | null = null;

export const getAWLWMSDBPOOL = async (): Promise<ConnectionPool> => {
  if (pool1) {
    return pool1;
  }

  pool1 = new ConnectionPool(config1);
  await pool1.connect();

  return pool1;
};
