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

function parseConnectionString(connectionString: string): DbConfig | null {
  const regex = /^([^/]+)\/([^@]+)@([^:]+):(\d+)\/(.+)$/;
  const match = connectionString.match(regex);
  if (!match) {
    console.error(`無効な接続文字列: ${connectionString}`);
    return null;
  }
  const [, user, password, host, port, serviceName] = match;
  return {
    user,
    password,
    host,
    port: Number(port),
    serviceName,
  };
}

export function getDbInfo(): DbInfo {
  const dbInfo: DbInfo = {};
  for (let i = 0; i < 20; i++) {
    const label = process.env[`ORACLE_DB_${i}_LABEL`];
    const connectionString = process.env[`ORACLE_DB_${i}_CONNECTION_STRING`];

    if (!label || !connectionString) {
      break;
    }
    const config = parseConnectionString(connectionString);
    if (config) {
      dbInfo[label] = config;
    }
  }
  return dbInfo;
}

export function getOracleClientMode(): string {
  return process.env.ORACLE_CLIENT_MODE || "";
}

export function getMongoDbInfo(): { uri: string; db: string } | null {
  const uri = process.env.MONGODB_URI;
  const db = process.env.MONGODB_DB;
  if (!uri || !db) {
    return null;
  }
  return { uri, db };
}
