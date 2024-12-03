import express from "express";
import Database from "better-sqlite3";

const router = express.Router();
const db = new Database("./db/test_data.db");

// Endpoint to get an Purchasing table by ID
router.get("/purchasing/:id", (req, res) => {
    const { id } = req.params;
    try {
        const row = db
            .prepare("SELECT * FROM Purchasing WHERE NCRFormID = ?")
            .get(id);
        if (row) {
            res.json(row);
        } else {
            res.status(404).send("Purchasing record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to insert data into Purchasing table with NCRFormID as a parameter
router.post("/purchasing/:NCRFormID", (req, res) => {
    const { NCRFormID } = req.params;
    const {
        Decision,
        CarRaised,
        FollowUp,
        CARNumber,
        FollowUpType,
        FollowUpDate,
        PurchasingStatus,
        User_id,
    } = req.body;
    try {
        const LastModified = new Date().toISOString().split("T")[0];
        const stmt = db.prepare(
            "INSERT INTO Purchasing (NCRFormID, PreliminaryDecision, CARRaised, CARNumber, FollowUpRequired, FollowUpType, FollowUpDate, PurchasingStatus, LastModified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        const result = stmt.run(
            Decision,
            CarRaised,
            FollowUp,
            CARNumber,
            FollowUpType,
            FollowUpDate,
            PurchasingStatus,
            LastModified
        );

        // Create the formusers relation
        const formUsersStmt = db.prepare(
            "INSERT INTO FormUsers (NCRForm_id, User_id) VALUES (?, ?)"
        );
        formUsersStmt.run(NCRFormID, User_id);

        // Set up the notification properties we'd like to display
        result.type = "Purchasing";
        result.Status = PurchasingStatus;
        result.Decision = Decision;
        result.LastModified = LastModified;
        result.NewOrEdit = "New";
        result.NCRFormID = NCRFormID;
        result.UserID = User_id;

        res.json({ form: result });
        //res.status(200).send("Purchasing record inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert purchasing record.");
    }
});

// Endpoint to update a specific record in the Purchasing table by ID
router.put("/purchasing/:NCRFormID", (req, res) => {
    const { NCRFormID } = req.params;
    const {
        Decision,
        CarRaised,
        FollowUp,
        CARNumber,
        FollowUpType,
        FollowUpDate,
        PurchasingStatus,
        User_id,
    } = req.body;
    try {
        const LastModified = new Date().toISOString().split("T")[0];
        const stmt = db.prepare(
            "UPDATE Purchasing SET Decision = ?, CarRaised = ?, CARNumber = ?, FollowUpType = ?, FollowUpDate = ?, LastModified = ? WHERE NCRFormID = ?"
        );
        const result = stmt.run(
            Decision,
            CarRaised,
            FollowUp,
            CARNumber,
            FollowUpType,
            FollowUpDate,
            PurchasingStatus,
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
            result.Status = PurchasingStatus;
            result.Decision = Decision;
            result.LastModified = LastModified;
            result.NewOrEdit = "Edit";
            result.NCRFormID = NCRFormID;
            result.UserID = User_id;

            res.json({ form: result });
        } else {
            res.status(404).send("Purchasing record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update purchasing record.");
    }
});

export default router;