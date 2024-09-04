import oracledb, { Connection, Result } from "oracledb";

// 接続設定
const dbConfig: oracledb.ConnectionAttributes = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

let pool: oracledb.Pool | null = null;

export async function initialize(): Promise<void> {
  try {
    pool = await oracledb.createPool(dbConfig);
    console.log("Connection pool created");
  } catch (err) {
    console.error("Error creating connection pool:", err);
    throw err;
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    try {
      await pool.close(10);
      console.log("Pool closed");
    } catch (err) {
      console.error("Error closing pool:", err);
      throw err;
    }
  }
}

export async function execute<T>(
  sql: string,
  binds: any[] = [],
  opts: oracledb.ExecuteOptions = {}
): Promise<Result<T>> {
  let connection: Connection | undefined;
  try {
    connection = await pool!.getConnection();
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

export async function executeDynamicQuery(
  sql: string,
  binds: Record<string, any>
): Promise<QueryResult> {
  if (!pool) {
    await initialize();
  }

  const processedBinds = Object.entries(binds)
    .filter(([key]) => !key)
    .reduce((acc, [key, value]) => {
      acc[key] = validateAndConvertBindValue(value);
      return acc;
    }, {} as Record<string, oracledb.BindParameter>);

  let connection: Connection | undefined;
  try {
    connection = await pool!.getConnection();
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
