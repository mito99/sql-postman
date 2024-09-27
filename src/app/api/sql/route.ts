import { executeDynamicQuery } from "@/lib/oracledb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { dbName, sqlQuery, binds } = await request.json();

    const sanitizedSqlQuery = sqlQuery.trim().replace(/;+$/, "");
    const { rows, columns } = await executeDynamicQuery({
      dbName,
      sql: sanitizedSqlQuery,
      binds,
    });

    return NextResponse.json({
      status: "success",
      data: rows,
      columns,
    });
  } catch (error) {
    console.error("SQL 実行エラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      status: "error",
      message: `SQL 実行中にエラーが発生しました。${errorMessage}`,
    });
  }
}
