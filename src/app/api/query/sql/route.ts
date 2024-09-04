import { executeDynamicQuery } from "@/lib/oracledb"; // executeDynamicQuery をインポート
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { sqlQuery, binds } = await request.json(); // binds パラメータを追加

    // executeDynamicQuery を使用してクエリを実行
    const { rows, columns } = await executeDynamicQuery(sqlQuery, binds);

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
