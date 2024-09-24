import dbInfo from "@/config/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const labels = Object.keys(dbInfo);
    return NextResponse.json({ labels });
  } catch (error) {
    console.error("データベースラベルの取得エラー:", error);
    return NextResponse.json(
      { message: "データベースラベルの取得に失敗しました。" },
      { status: 500 }
    );
  }
}
