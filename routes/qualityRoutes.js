import express from 'express';
import Database from 'better-sqlite3';

const router = express.Router();
const db = new Database('./db/test_data.db');

// Endpoint to get Quality table
router.get("/quality", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM Quality").all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get a Quality table by ID
router.get("/quality/:id", (req, res) => {
    const { id } = req.params;
    try {
        const row = db
            .prepare("SELECT * FROM Quality WHERE NCRFormID = ?")
            .get(id);
        if (row) {
            res.json(row);
        } else {
            res.status(404).send("Quality record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to insert data into Quality table
router.post("/quality/", (req, res) => {
    const {
        SalesOrder,
        SRInspection,
        WorkInProgress,
        ItemDescription,
        QuantityReceived,
        QuantityDefective,
        IsNonConforming,
        Details,
        ProductID,
        User_id,
    } = req.body;
    try {
        const lastModified = new Date().toISOString().split("T")[0];
        const creationDate = lastModified;
        const formStatus = "Open";

        // Create NCRForm
        const ncrFormStmt = db.prepare(
            "INSERT INTO NCRForm (CreationDate, LastModified, FormStatus) VALUES (?, ?, ?)"
        );

        const info = ncrFormStmt.run(creationDate, lastModified, formStatus);
        const NCRFormID = info.lastInsertRowid;

        const currentYear = new Date().getFullYear();
        const row = db
            .prepare(
                "SELECT COUNT(*) AS count FROM Quality WHERE NCRNumber LIKE ?"
            )
            .get(`${currentYear}-%`);
        const ncrCount = row.count + 1;
        const ncrNumber = `${currentYear}-${String(ncrCount).padStart(3, "0")}`;

        // Create the Quality data
        const qualityStmt = db.prepare(
            "INSERT INTO Quality (NCRFormID, NCRNumber, SalesOrder, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, QualityStatus, LastModified, ProductID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        const result = qualityStmt.run(
            NCRFormID,
            ncrNumber,
            SalesOrder,
            SRInspection,
            WorkInProgress,
            ItemDescription,
            QuantityReceived,
            QuantityDefective,
            IsNonConforming,
            Details,
            formStatus,
            lastModified,
            ProductID
        );

        // Create the formusers relation
        const formUsersStmt = db.prepare(
            "INSERT INTO FormUsers (NCRForm_id, User_id) VALUES (?, ?)"
        );
        formUsersStmt.run(NCRFormID, User_id);

        // Set up the notification properties we'd like to display
        result.type = "Quality";
        result.Status = "Open";
        result.Details = Details;
        result.ItemDescription = ItemDescription;
        result.LastModified = lastModified;
        result.NewOrEdit = "New";
        result.NCRFormID = NCRFormID;
        result.UserID = User_id;

        res.json({ form: result });
        //res.status(200).send("NCRForm and Quality record inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert quality record.");
    }
});

// Endpoint to update a specific record in the Quality table by ID
router.put("/quality/:NCRFormID", (req, res) => {
    const { NCRFormID } = req.params;
    const {
        SalesOrder,
        SRInspection,
        WorkInProgress,
        ItemDescription,
        QuantityReceived,
        QuantityDefective,
        IsNonConforming,
        Details,
        QualityStatus,
        ProductID,
        User_id,
    } = req.body;
    try {
        const LastModified = new Date().toISOString().split("T")[0];
        const stmt = db.prepare(
            "UPDATE Quality SET SalesOrder = ?, SRInspection = ?, WorkInProgress = ?, ItemDescription = ?, QuantityReceived = ?, QuantityDefective = ?, IsNonConforming = ?, Details = ?, ProductID = ?, QualityStatus = ?, LastModified = ? WHERE NCRFormID = ?"
        );
        const result = stmt.run(
            SalesOrder,
            SRInspection,
            WorkInProgress,
            ItemDescription,
            QuantityReceived,
            QuantityDefective,
            IsNonConforming,
            Details,
            ProductID,
            QualityStatus,
            LastModified,
            NCRFormID
        );
        if (result.changes > 0) {
            // Create the formusers relation
            const formUsersStmt = db.prepare(
                "INSERT INTO FormUsers (NCRForm_id, User_id) VALUES (?, ?)"
            );
            formUsersStmt.run(NCRFormID, User_id);

            // Set up the notification properties we'd like to display
            result.type = "Quality";
            result.Status = QualityStatus;
            result.Details = Details;
            result.ItemDescription = ItemDescription;
            result.LastModified = LastModified;
            result.NewOrEdit = "Edit";
            result.NCRFormID = NCRFormID;
            result.UserID = User_id;

            res.json({ form: result });
        } else {
            res.status(404).send("Quality record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update quality record.");
    }
});

export default router;