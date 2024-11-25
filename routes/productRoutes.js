import express from 'express';
import Database from 'better-sqlite3';

const router = express.Router();
const db = new Database('./db/test_data.db');

// Endpoint to get records from Product table
router.get("/products", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM Product").all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to insert data into Product table
router.put("/products/", (req, res) => {
    const { ProductName, Number, SupplierID } = req.body;
    try {
        const stmt = db.prepare(
            "INSERT INTO Product (ProductName, Number, SupplierID) VALUES (?, ?, ?)"
        );
        stmt.run(ProductName, Number, SupplierID);
        res.status(200).send("Product inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert product.");
    }
});

// Endpoint to get a specific Product by ID
router.get("/products/:id", (req, res) => {
    const { id } = req.params;
    try {
        const row = db.prepare("SELECT * FROM Product WHERE id = ?").get(id);
        if (row) {
            res.json(row);
        } else {
            res.status(404).send("Product not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

export default router;