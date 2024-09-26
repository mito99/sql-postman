import { getDbInfo, getOracleClientMode } from "@/config/db";
import oracledb, { Connection, Result } from "oracledb";

// 環境変数 ORACLE_CLIENT_MODE でThick/Thinモードを切り替える
const isThickMode = getOracleClientMode() === "thick";
if (isThickMode) {
  oracledb.initOracleClient();
}

interface BindItem {
  key: string;
  value: any;
}

async function getConnection(dbName?: string): Promise<Connection> {
  const dbInfo = getDbInfo();
  const dbConfig: oracledb.ConnectionAttributes = {
    user: dbInfo[dbName || "app1"].user,
    password: dbInfo[dbName || "app1"].password,
    connectString: `${dbInfo[dbName || "app1"].host}:${
      dbInfo[dbName || "app1"].port
    }/${dbInfo[dbName || "app1"].serviceName}`,
  };
  return await oracledb.getConnection(dbConfig);
}

export async function execute<T>(
  sql: string,
  binds: any[] = [],
  opts: oracledb.ExecuteOptions = {},
  dbName?: string
): Promise<Result<T>> {
  let connection: Connection | undefined;
  try {
    connection = await getConnection(dbName);
    const result = await connection.execute<T>(sql, binds, opts);
    return result;
  } catch (err) {
    console.error("Error executing SQL:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

export interface QueryResult {
  rows: any[];
  columns: string[];
}

export async function executeDynamicQuery({
  dbName,
  sql,
  binds,
}: {
  dbName?: string;
  sql: string;
  binds: BindItem[];
}): Promise<QueryResult> {
  const processedBinds = binds
    .filter((item) => item.key)
    .reduce((acc, { key, value }) => {
      acc[key] = validateAndConvertBindValue(value);
      return acc;
    }, {} as Record<string, oracledb.BindParameter>);

  let connection: Connection | undefined;
  try {
    connection = await getConnection(dbName);
    const result = await connection.execute(sql, processedBinds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      resultSet: true,
    });

    if (!result.resultSet) {
      throw new Error("Query did not return a result set");
    }

    const rows = await result.resultSet.getRows();
    const columns = result.metaData
      ? result.metaData.map((col) => col.name)
      : [];

    await result.resultSet.close();

    return { rows, columns };
  } catch (err) {
    console.error("Error executing SQL:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// バインド変数の値を検証し、必要に応じて変換する関数
function validateAndConvertBindValue(value: any): oracledb.BindParameter {
  if (value === null || value === undefined) {
    return { val: null, type: oracledb.STRING };
  }

  switch (typeof value) {
    case "string":
      return { val: value, type: oracledb.STRING };
    case "number":
      return { val: value, type: oracledb.NUMBER };
    case "object":
      if (value instanceof Date) {
        return { val: value, type: oracledb.DATE };
      }
      throw new Error(`Unsupported bind data type: ${value}`);
    default:
      throw new Error(`Unsupported bind data type: ${value}`);
  }
}

// バインド変数オブジェクトを処理する関数
function processBinds(
  binds: Record<string, any>
): Record<string, oracledb.BindParameter> {
  return Object.entries(binds).reduce((acc, [key, item], index) => {
    try {
      acc[item.key] = validateAndConvertBindValue(item.value);
      return acc;
    } catch (e) {
      const error = e as Error;
      throw new Error(
        `Invalid bind data for parameter ${index + 1} (${key}): ${
          error.message
        }`
      );
    }
  }, {} as Record<string, oracledb.BindParameter>);
}
