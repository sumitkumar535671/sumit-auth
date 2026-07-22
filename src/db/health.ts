import { pool } from "./index.js";

export default async function verifyDatabaseConnection() {
    // console.log("Verifying database connection...");
    await pool.query("SELECT 1");
    // console.log("Database connection verified successfully.");
}