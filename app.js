import Database from "better-sqlite3";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createTables, seedRoles, seedData, dropTables } from "./cmds/querytest.js";

// Our routes
import ncrRoutes from "./routes/ncrRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import qualityRoutes from "./routes/qualityRoutes.js";
import engineerRoutes from "./routes/engineerRoutes.js";
import purchasingRoutes from "./routes/purchasingRoutes.js";

const db = new Database("./db/test_data.db");
const app = express();
const port = 5500;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the public directory
app.use(express.static("public"));

// Drop tables if they exist
dropTables.forEach((query) => db.exec(query));

// Create tables
createTables.forEach((query) => db.exec(query));

// Fill tables with seed data
seedRoles.forEach((query) => db.exec(query));



try {
    seedData.User_INSERT.forEach((query) => db.exec(query));
    seedData.NCRForms_INSERT.forEach((query) => db.exec(query));
    seedData.FormUsers_INSERT.forEach((query) => db.exec(query));
    seedData.Suppliers_INSERT.forEach((query) => db.exec(query));
    seedData.Products_INSERT.forEach((query) => db.exec(query));
    seedData.QualityForms_INSERT.forEach((query) => db.exec(query));
    seedData.EngineerForms_INSERT.forEach((query) => db.exec(query));
    seedData.PurchasingForms_INSERT.forEach((query) => db.exec(query));
} catch (error) {
    console.error("Database error:", error);
}
    



// Our routes
app.use("/", ncrRoutes);
app.use("/", productRoutes);
app.use("/", userRoutes);
app.use("/", supplierRoutes);
app.use("/", qualityRoutes);
app.use("/", engineerRoutes);
app.use("/", purchasingRoutes)

// Endpoint to get the single most recent NCRFormID
app.get("/recent-ncr", (req, res) => {
    try {
        const row = db
            .prepare(
                "SELECT id FROM NCRForm ORDER BY creationDate DESC LIMIT 1"
            )
            .get();
        res.json(row);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch recent NCRFormID.");
    }
});

// Endpoint to get data from the NCRform table, quality table and supplier table for the NCRs page
app.get("/SummaryInfo", (req, res) => {
    try {
        const rows = db
            .prepare(
                "SELECT NCRForm.id, NCRForm.CreationDate, NCRForm.LastModified, NCRForm.FormStatus, Quality.NCRNumber, Supplier.SupplierName FROM NCRForm JOIN Quality ON NCRForm.id = Quality.NCRFormID JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id"
            )
            .all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// app to get summary data filtered by supplier number, status, and date range
app.get("/FilterSummaryInfo", (req, res) => {
    const { supplierFilter, status, date1, date2 } = req.query;
    try {
        const statusWild = `%${status}%`;
        const supplierWildcards = `%${supplierFilter}%`;
        const rows = db
            .prepare(
                "SELECT NCRForm.id, NCRForm.CreationDate, NCRForm.LastModified, NCRForm.FormStatus, Quality.NCRNumber, Supplier.SupplierName FROM NCRForm JOIN Quality ON NCRForm.id = Quality.NCRFormID JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id WHERE Supplier.SupplierName LIKE ? AND NCRForm.FormStatus LIKE ? AND NCRForm.LastModified BETWEEN ? AND ?"
            )
            .all(supplierWildcards, statusWild, date1, date2);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get all NCR data given an id
app.get("/AllInfo", (req, res) => {
    const { id } = req.query;
    try {
        //const rows = db.prepare('SELECT * FROM NCRForm JOIN Quality ON NCRForm.id = Quality.NCRFormID JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id JOIN Engineer ON NCRForm.id = Engineer.NCRFormID').all();
        const rows = db
            .prepare(
                "SELECT * FROM NCRForm JOIN Quality ON Quality.NCRFormID = NCRForm.id JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id JOIN Engineer ON NCRForm.id = Engineer.NCRFormID WHERE NCRForm.id = ?"
            )
            .all(id);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get NCR data sorted by a field ASCENDING
app.get("SortAsc"),
    (req, res) => {
        const { sortfield } = req.query;
        try {
            const rows = db
                .prepare(
                    "SELECT NCRForm.id, NCRForm.CreationDate, NCRForm.LastModified, NCRForm.FormStatus, Quality.NCRNumber, Supplier.SupplierName FROM NCRForm JOIN Quality ON NCRForm.id = Quality.NCRFormID JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id WHERE "
                )
                .all();
            res.json(rows);
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).send("Failed to fetch data.");
        }
    };

// Endpoint to update status on NCRForm
app.put("/UpdateNCRStatus", (req, res) => {
    const { newStatus, id } = req.query;
    try {
        const stmt = db.prepare(
            "UPDATE NCRForm SET FormStatus = ? WHERE id = ?"
        );
        const result = stmt.run(newStatus, id);
        if (result.changes > 0) {
            res.status(200).send("NCR record updated successfully!");
        } else {
            res.status(404).send("NCR record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update NCR form record.");
    }
});

// Endpoint to update status on Quality
app.put("/UpdateQAStatus", (req, res) => {
    const { newStatus, id } = req.query;
    try {
        const stmt = db.prepare(
            "UPDATE Quality SET QualityStatus = ? WHERE NCRFormID = ?"
        );
        const result = stmt.run(newStatus, id);
        if (result.changes > 0) {
            res.status(200).send(
                "Quality Assurance record updated successfully!"
            );
        } else {
            res.status(404).send("Quality Assurance record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Quality Assurance to update NCR form record.");
    }
});

// Endpoint to update status on Engineer
app.put("/UpdateEngineerStatus", (req, res) => {
    const { newStatus, id } = req.query;
    try {
        const stmt = db.prepare(
            "UPDATE Engineer SET EngineerStatus = ? WHERE NCRFormID = ?"
        );
        const result = stmt.run(newStatus, id);
        if (result.changes > 0) {
            res.status(200).send("Engineer record updated successfully!");
        } else {
            res.status(404).send("Engineer record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update NCR form record.");
    }
});

app.put("/UpdatePurchasingStatus", (req, res) => {
    const { newStatus, id } = req.query;
    try {
        const stmt = db.prepare(
            "UPDATE Purchasing SET PurchasingStatus = ? WHERE NCRFormID = ?"
        );
        const result = stmt.run(newStatus, id);
        if (result.changes > 0) {
            res.status(200).send("Purchasing record updated successfully!");
        } else {
            res.status(404).send("Purchasing record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update NCR form record.");
    }
});


// Endpoint to get NCR by id
app.get("/ncrFromID", (req, res) => {
    const { ncrID } = req.query;
    try {
        const rows = db
            .prepare("SELECT * FROM NCRForm WHERE NCRForm.id = ?")
            .all(ncrID);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get Quality by NCRFormID
app.get("/QualityFromNCR", (req, res) => {
    const { ncrID } = req.query;
    try {
        const rows = db
            .prepare("SELECT * FROM Quality WHERE Quality.NCRFormID = ?")
            .all(ncrID);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get Engineer by NCRFormID
app.get("/EngineerFromNCR", (req, res) => {
    const { ncrID } = req.query;
    try {
        const rows = db
            .prepare("SELECT * FROM Engineer WHERE Engineer.NCRFormID = ?")
            .all(ncrID);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get Purchasing data by NCRFormID
app.get("/PurchasingFromNCR", (req, res) => {
    const { ncrID } = req.query;
    try {
        const rows = db
            .prepare("SELECT * FROM Purchasing WHERE NCRFormID = ?")
            .all(ncrID);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch purchasing data.");
    }
});


// Endpoint to get the 5 most recent NCR forms
app.get("/recent-ncrs", (req, res) => {
    try {
        const rows = db
            .prepare(
                `
            SELECT NCRForm.id, NCRForm.CreationDate, NCRForm.LastModified, NCRForm.FormStatus, Quality.NCRNumber, Supplier.SupplierName
            FROM NCRForm
            JOIN Quality ON NCRForm.id = Quality.NCRFormID
            JOIN Product ON Quality.ProductID = Product.id
            JOIN Supplier ON Product.SupplierID = Supplier.id
            ORDER BY NCRForm.LastModified DESC
            LIMIT 5
        `
            )
            .all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch recent NCR forms.");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// MAKE SURE TO RUN THIS FILE USING
// npm run start
// IN THE TERMINAL

// Use db.exec when you want to execute SQL statements w/o parameters
// Use db.prepare when you want to have a select you know you will be executing numerous times or using variable data like
// const thing = db.prepare("INSERT INTO User (name, email) VALUES (?, ?)");
// thing.run("Test", "test@test.com");
// db.close(); for when we are done working with the database and need to shut it off to prevent memory leakage
