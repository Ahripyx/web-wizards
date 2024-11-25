import express from "express";
import Database from "better-sqlite3";

const router = express.Router();
const db = new Database("./db/test_data.db");

// Endpoint to get NCRForm table
router.get("/ncrs", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM NCRForm").all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get all Supplier related data by NCRForm ID
router.get("/ncrs/:id", (req, res) => {
    const { id } = req.params;
    try {
        const row = db
            .prepare(
                "SELECT * FROM NCRForm JOIN Quality ON Quality.NCRFormID = NCRForm.id JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id WHERE NCRForm.id = ?"
            )
            .all(id);
        if (row.length > 0) {
            res.json(row);
        } else {
            res.status(404).send("NCRForm not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

export default router;
