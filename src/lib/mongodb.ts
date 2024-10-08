import { Query } from "@/components/sql-editor";
import { getMongoDbInfo } from "@/config/db";
import { MongoClient, ObjectId } from "mongodb";

let client: MongoClient;
let db: any;

export async function connectToDatabase() {
  const { uri, db: dbName } = getMongoDbInfo() || {};
  if (!uri || !dbName) {
    throw new Error("MongoDB connection info is not set");
  }

  if (client) {
    return db;
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  return db;
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
  }
}

export async function getData(collectionName: string, query: any = {}) {
  const db = await connectToDatabase();
  const collection = db.collection(collectionName);
  const data = await collection.find(query).toArray();
  return data;
}

export async function saveData(collectionName: string, data: Query) {
  const db = await connectToDatabase();
  const collection = db.collection(collectionName);
  const { _id, ...dataWithoutId } = data;
  if (_id) {
    const result = await collection.updateOne(
      { _id: new ObjectId(data._id) },
      { $set: dataWithoutId },
      { upsert: true }
    );
    return {
      _id: data._id,
      ...dataWithoutId,
    };
  } else {
    const result = await collection.insertOne(dataWithoutId);
    return {
      _id: result.insertedId,
      ...dataWithoutId,
    };
  }
}
