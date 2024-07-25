import postgres from "postgres";
import express from "express";
import dotenv from "dotenv";
import os from "os";

dotenv.config();

const app = express();
console.log(process.env.LINK_DB);
const sql = postgres(process.env.LINK_DB);

app.get("/count", async (req, res) => {
    await sql`
    CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW()
        name VARCHAR(255) NOT NULL
    );
    `
    const result = await sql`INSERT INTO visits (name) VALUES ('${os.hostname()}') RETURN`;

    res.json({ count: result.length });
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3000");
});