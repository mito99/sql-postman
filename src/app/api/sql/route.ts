import { executeDynamicQuery } from "@/lib/oracledb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { dbName, sqlQuery, binds } = await request.json();

    const { rows, columns } = await executeDynamicQuery({
      dbName,
      sql: sqlQuery,
      binds,
    });

    return NextResponse.json({
      status: "success",
      data: rows,
      columns,
    });
  } catch (error) {
    console.error("SQL 実行エラー:", error);
    return NextResponse.json({
      status: "error",
      message: "SQL 実行中にエラーが発生しました。",
    });
  }
}
