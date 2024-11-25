import express from 'express';
import Database from 'better-sqlite3';

const router = express.Router();
const db = new Database('./db/test_data.db');

// Endpoint to get Supplier table
router.get("/suppliers", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM Supplier").all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to insert data into Supplier table
router.put("/suppliers", (req, res) => {
    const { SupplierName } = req.body;
    try {
        const stmt = db.prepare(
            "INSERT INTO Supplier (SupplierName) VALUES (?)"
        );
        stmt.run(SupplierName);
        res.status(200).send("Supplier inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert supplier.");
    }
});

export default router;