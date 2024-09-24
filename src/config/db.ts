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

const dbInfo: DbInfo = (() => {
  const dbInfo: DbInfo = {};
  let index = 1;
  while (true) {
    const label = process.env[`ORACLE_DB_${index}_LABEL`];
    const connectionString =
      process.env[`ORACLE_DB_${index}_CONNECTION_STRING`];

    if (!label || !connectionString) {
      break;
    }

    const config = parseConnectionString(connectionString);
    if (config) {
      dbInfo[label] = config;
    }

    index++;
  }
  return dbInfo;
})();

export default dbInfo;
