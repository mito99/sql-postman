interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  serviceName: string;
}

interface DbInfo {
  [key: string]: DbConfig;
}

const dbInfo: DbInfo = {
  app1: {
    host: "localhost",
    port: Number(process.env.DB_PORT) || 1521,
    user: process.env.DB_USER || "system",
    password: process.env.DB_PASSWORD || "oracle",
    serviceName: process.env.DB_SERVICE_NAME || "orcl",
  },
};

export default dbInfo;
