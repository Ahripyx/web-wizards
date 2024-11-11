import Database from 'better-sqlite3';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createTables } from './cmds/queries.js';
import { seedTables } from './cmds/queries.js';

const db = new Database('./db/test_data.db');
const app = express();
const port = 5500;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the public directory
app.use(express.static('public'));

// Create tables
createTables.forEach(query => db.exec(query));

// Fill tables with seed data ( COMMENT THIS OUT AFTER FIRST RUN )
//seedTables.forEach(query => db.exec(query));

// Endpoint to get NCRForm table
app.get('/ncrforms', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM NCRForm').all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to insert data in NCRForm table
app.post('/insert-form', (req, res) => {
    const { CreationDate, LastModified, FormStatus } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO NCRForm (CreationDate, LastModified, FormStatus) VALUES (?, ?, ?)');
        stmt.run(CreationDate, LastModified, FormStatus);
        res.status(200).send("Data inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert data.");
    }
});

// Endpoint to get records from Product table
app.get('/products', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM Product').all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to insert data into Product table
app.post('/insert-product', (req, res) => {
    const { id, Name, Number, SupplierID } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO Product (id, Name, Number, SupplierID) VALUES (?, ?, ?, ?)');
        stmt.run(id, Name, Number, SupplierID);
        res.status(200).send("Product inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert product.");
    }
});

// Endpoint to update data in Product table
app.post('/update-product', (req, res) => {
    const { id, Name, Number, SupplierID } = req.body;
    try {
        const stmt = db.prepare('UPDATE Product SET Name = ?, Number = ?, SupplierID = ? WHERE id = ?');
        stmt.run(Name, Number, SupplierID, id);
        res.status(200).send("Product updated successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update product.");
    }
});

// Endpoint to get User table
app.get('/users', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM User').all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to insert data in User table
app.post('/insert-user', (req, res) => {
    const { FName, MName, LName, Email, Password, RoleID } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO User (FName, MName, LName, Email, Password, RoleID) VALUES (?, ?, ?, ?, ?, ?)');
        stmt.run(FName, MName, LName, Email, Password, RoleID);
        res.status(200).send("Data inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert data.");
    }
});

// Endpoint to get Supplier table
app.get('/suppliers', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM Supplier').all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get Quality table
app.get('/quality', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM Quality').all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to insert data into Quality table
app.post('/insert-quality', (req, res) => {
    const { id, NCRNumber, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, LastModified, ProductID } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO Quality (id, NCRNumber, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, LastModified, ProductID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(id, NCRNumber, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, LastModified, ProductID);
        res.status(200).send("Quality record inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert quality record.");
    }
});

// Endpoint to update data in Quality table
app.post('/update-quality', (req, res) => {
    const { id, NCRNum, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, LastModified, ProductID } = req.body;
    try {
        const stmt = db.prepare('UPDATE Quality SET NCRNum = ?, SRInspection = ?, WorkInProgress = ?, ItemDescription = ?, QuantityReceived = ?, QuantityDefective = ?, IsNonConforming = ?, Details = ?, LastModified = ?, ProductID = ? WHERE id = ?');
        stmt.run(NCRNum, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, LastModified, ProductID, id);
        res.status(200).send("Quality record updated successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update quality record.");
    }
});

// Endpoint to get data from the NCRform table, quality table and supplier table for the NCRs page
app.get('/SummaryInfo', (req, res) => {
    try {
        const rows = db.prepare('SELECT NCRForm.id, NCRForm.CreationDate, NCRForm.LastModified, NCRForm.FormStatus, Quality.NCRNumber, Supplier.Name as "SupplierName" FROM NCRForm JOIN Quality ON NCRForm.id = Quality.NCRFormID JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id').all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
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