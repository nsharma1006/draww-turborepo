import {configDotenv } from "dotenv" 
configDotenv()

export const JWT_PASS = process.env.JWT_SECRET || "1234"
export const DATABASE_URL = process.env.DATABASE_URL || ""
