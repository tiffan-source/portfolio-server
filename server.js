import postgres from "postgres";
import express from "express";
import dotenv from "dotenv";
import os from "os";

dotenv.config();

const app = express();
console.log(process.env.LINK_DB);
const sql = postgres(process.env.LINK_DB);

app.get("/drop", async (req, res) => {
    await sql`DROP TABLE IF EXISTS visits`;
    res.json({ message: "Table dropped" });
});

app.get("/count", async (req, res) => {
    await sql`
    CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        name VARCHAR(255) NOT NULL
    );
    `;
    const result = await sql`
        INSERT INTO visits (name) 
        VALUES (${os.hostname()}) 
        RETURNING id
    `;

    res.json({ count: result.length });
});

app.get("/list", async (req, res) => {
    const visits = await sql`SELECT * FROM visits`;
    res.json(visits);
})

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});
