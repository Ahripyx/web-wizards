import express from "express";
import Database from "better-sqlite3";

const router = express.Router();
const db = new Database("./db/test_data.db");

// Endpoint to get an Engineer table by ID
router.get("/engineer/:id", (req, res) => {
    const { id } = req.params;
    try {
        const row = db
            .prepare("SELECT * FROM Engineer WHERE NCRFormID = ?")
            .get(id);
        if (row) {
            res.json(row);
        } else {
            res.status(404).send("Engineer record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});
// Endpoint to insert data into Engineer table with NCRFormID as a parameter
router.post("/engineer/:NCRFormID", (req, res) => {
    const { NCRFormID } = req.params;
    const {
        Review,
        NotifyCustomer,
        Disposition,
        RevisionNumber,
        RevisionDate,
        EngineerStatus,
        User_id,
    } = req.body;
    try {
        const LastModified = new Date().toISOString().split("T")[0];
        const stmt = db.prepare(
            "INSERT INTO Engineer (NCRFormID, Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, EngineerStatus, LastModified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        const result = stmt.run(
            NCRFormID,
            Review,
            NotifyCustomer,
            Disposition,
            RevisionNumber,
            RevisionDate,
            EngineerStatus,
            LastModified
        );

        // Create the formusers relation
        const formUsersStmt = db.prepare(
            "INSERT INTO FormUsers (NCRForm_id, User_id) VALUES (?, ?)"
        );
        formUsersStmt.run(NCRFormID, User_id);

        // Set up the notification properties we'd like to display
        result.type = "Engineer";
        result.Status = EngineerStatus;
        result.Review = Review;
        result.LastModified = LastModified;
        result.NewOrEdit = "New";
        result.NCRFormID = NCRFormID;

        res.json({ form: result });
        //res.status(200).send("Engineer record inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert engineer record.");
    }
});

// Endpoint to update a specific record in the Engineer table by ID
router.put("/engineer/:NCRFormID", (req, res) => {
    const { NCRFormID } = req.params;
    const {
        Review,
        NotifyCustomer,
        Disposition,
        RevisionNumber,
        RevisionDate,
        EngineerStatus,
    } = req.body;
    try {
        const LastModified = new Date().toISOString().split("T")[0];
        const stmt = db.prepare(
            "UPDATE Engineer SET Review = ?, NotifyCustomer = ?, Disposition = ?, RevisionNumber = ?, RevisionDate = ?, LastModified = ? WHERE NCRFormID = ?"
        );
        const result = stmt.run(
            Review,
            NotifyCustomer,
            Disposition,
            RevisionNumber,
            RevisionDate,
            EngineerStatus,
            LastModified,
            NCRFormID
        );
        if (result.changes > 0) {
            // Set up the notification properties we'd like to display
            result.type = "Engineer";
            result.Status = EngineerStatus;
            result.Review = Review;
            result.LastModified = LastModified;
            result.NewOrEdit = "Edit";
            result.NCRFormID = NCRFormID;

            res.json({ form: result });
        } else {
            res.status(404).send("Engineer record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update engineer record.");
    }
});

export default router;