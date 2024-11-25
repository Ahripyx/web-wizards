import express from 'express';
import Database from 'better-sqlite3';

const router = express.Router();
const db = new Database('./db/test_data.db');

// Endpoint to get User table
router.get("/users", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM User").all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to insert data in User table
router.put("/users/", (req, res) => {
    const { FName, MName, LName, Email, Password, RoleID } = req.body;
    try {
        const stmt = db.prepare(
            "INSERT INTO User (FName, MName, LName, Email, Password, RoleID) VALUES (?, ?, ?, ?, ?, ?)"
        );
        stmt.run(FName, MName, LName, Email, Password, RoleID);
        res.status(200).send("User inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert user.");
    }
});

// Endpoint to get all users who worked on a specific NCRForm
router.get("/formusers/:id", (req, res) => {
    const { id } = req.params;
    try {
        const rows = db
            .prepare(
                `
            SELECT 
                "User".FName, "User".LName, Role.Title
            FROM FormUsers
            JOIN "User" ON FormUsers.User_id = "User".id
            JOIN Role ON "User".RoleID = Role.id 
            WHERE FormUsers.NCRForm_id = ?`
            )
            .all(id);
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).send("Users not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to insert data into FormUsers table
router.post("/formusers", (req, res) => {
    const { NCRForm_id, User_id } = req.body;
    try {
        const stmt = db.prepare(
            "INSERT INTO FormUsers (NCRForm_id, User_id) VALUES (?, ?)"
        );
        stmt.run(NCRForm_id, User_id);
        res.status(200).send("FormUsers record inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert FormUsers record.");
    }
});

// Endpoint to get Role table
router.get("/roles", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM Role").all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

export default router;