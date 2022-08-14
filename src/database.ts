import { MongoClient } from "mongodb";
import "dotenv/config";
const { DB_URL = "", DB_NAME } = process.env;

export const mongodbClient = new MongoClient(DB_URL);
export const db = mongodbClient.db(DB_NAME);
