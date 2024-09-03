import { Query } from "@/components/sql-editor";
import { connectToDatabase, saveData } from "@/lib/mongodb";

export async function POST(req: Request) {
  const { parameters, sqlQuery, group, name, _id } =
    (await req.json()) as Query;
  const db = await connectToDatabase();
  const collection = db.collection("queries");
  const result = await saveData("queries", {
    parameters,
    sqlQuery,
    group,
    name,
    _id,
  }); // データを保存
  return new Response(JSON.stringify({ message: "保存しました" }));
}

export async function GET(req: Request) {
  const db = await connectToDatabase();
  const collection = db.collection("queries");
  const queries = (await collection.find({}).toArray()) as Query[];
  return new Response(JSON.stringify(queries));
}
