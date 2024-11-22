import Database from 'better-sqlite3';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createTables, seedTables, dropTables } from './cmds/queries.js';

const db = new Database('./db/test_data.db');
const app = express();
const port = 5500;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the public directory
app.use(express.static('public'));

// Drop tables if they exist
dropTables.forEach(query => db.exec(query));

// Create tables
createTables.forEach(query => db.exec(query));

// Fill tables with seed data
seedTables.forEach(query => db.exec(query));

// Endpoint to get NCRForm table
app.get('/ncrs', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM NCRForm').all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get all Supplier related data by NCRForm ID
app.get('/ncrs/:id', (req, res) => {
    const { id } = req.params;
    try {
        const row = db.prepare('SELECT * FROM NCRForm JOIN Quality ON Quality.NCRFormID = NCRForm.id JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id WHERE NCRForm.id = ?').all(id);
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
app.put('/products/', (req, res) => {
    const { ProductName, Number, SupplierID } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO Product (ProductName, Number, SupplierID) VALUES (?, ?, ?)');
        stmt.run(ProductName, Number, SupplierID);
        res.status(200).send("Product inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert product.");
    }
});

// Endpoint to get a specific Product by ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    try {
        const row = db.prepare('SELECT * FROM Product WHERE id = ?').get(id);
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

app.get('/product&suppliers', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM Supplier JOIN Product ON Supplier.id = Product.SupplierID').all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");

    }
});

// Endpoint to get all products by SupplierID
app.get('/products/suppliers/:id', (req, res) => {
    const { id } = req.params;
    try {
        const rows = db.prepare('SELECT * FROM Product WHERE SupplierID = ?').all(id);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch products.");
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
app.put('/users/', (req, res) => {
    const { FName, MName, LName, Email, Password, RoleID } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO User (FName, MName, LName, Email, Password, RoleID) VALUES (?, ?, ?, ?, ?, ?)');
        stmt.run(FName, MName, LName, Email, Password, RoleID);
        res.status(200).send("User inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert user.");
    }
});

// Endpoint to get all users who worked on a specific NCRForm
app.get('/formusers/:id', (req, res) => {
    const { id } = req.params;
    try {
        const rows = db.prepare(`
            SELECT 
                "User".FName, "User".LName, Role.Title
            FROM FormUsers
            JOIN "User" ON FormUsers.User_id = "User".id
            JOIN Role ON "User".RoleID = Role.id 
            WHERE FormUsers.NCRForm_id = ?`).all(id);
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
app.post('/formusers', (req, res) => {
    const { NCRForm_id, User_id } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO FormUsers (NCRForm_id, User_id) VALUES (?, ?)');
        stmt.run(NCRForm_id, User_id);
        res.status(200).send("FormUsers record inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert FormUsers record.");
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





// Endpoint to insert data into Supplier table
app.put('/suppliers', (req, res) => {
    const { SupplierName } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO Supplier (SupplierName) VALUES (?)');
        stmt.run(SupplierName);
        res.status(200).send("Supplier inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert supplier.");
    }
});

// Endpoint to get Role table
app.get('/roles', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM Role').all();
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

// Endpoint to get a Quality table by ID
app.get('/quality/:id', (req, res) => {
    const { id } = req.params;
    try {
        const row = db.prepare('SELECT * FROM Quality WHERE NCRFormID = ?').get(id);
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
app.post('/quality/', (req, res) => {
    const { SalesOrder, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, ProductID, User_id } = req.body;
    try {
        const lastModified = new Date().toISOString().split('T')[0];
        const creationDate = lastModified;
        const formStatus = 'Open';

        // Create NCRForm
        const ncrFormStmt = db.prepare('INSERT INTO NCRForm (CreationDate, LastModified, FormStatus) VALUES (?, ?, ?)');

        const info = ncrFormStmt.run(creationDate, lastModified, formStatus);
        const ncrFormID = info.lastInsertRowid;

        const currentYear = new Date().getFullYear();
        const row = db.prepare("SELECT COUNT(*) AS count FROM Quality WHERE NCRNumber LIKE ?").get(`${currentYear}-%`);
        const ncrCount = row.count + 1;
        const ncrNumber = `${currentYear}-${String(ncrCount).padStart(3, '0')}`;

        // Create the Quality data
        const qualityStmt = db.prepare('INSERT INTO Quality (NCRFormID, NCRNumber, SalesOrder, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, QualityStatus, LastModified, ProductID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        const newQuality = qualityStmt.run(ncrFormID, ncrNumber, SalesOrder, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, formStatus, lastModified, ProductID);

        // Create the formusers relation
        const formUsersStmt = db.prepare('INSERT INTO FormUsers (NCRForm_id, User_id) VALUES (?, ?)');
        formUsersStmt.run(ncrFormID, User_id);
        res.json({form: newQuality });
        //res.status(200).send("NCRForm and Quality record inserted successfully!");

        
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert quality record.");
    }
});

// Endpoint to update a specific record in the Quality table by ID
app.put('/quality/:NCRFormID', (req, res) => {
    const { NCRFormID } = req.params;
    const { SalesOrder, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, QualityStatus, ProductID } = req.body;
    try {
        const LastModified = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0];
        const stmt = db.prepare('UPDATE Quality SET SalesOrder = ?, SRInspection = ?, WorkInProgress = ?, ItemDescription = ?, QuantityReceived = ?, QuantityDefective = ?, IsNonConforming = ?, Details = ?, ProductID = ?, QualityStatus = ?, LastModified = ? WHERE NCRFormID = ?');
        const result = stmt.run(SalesOrder, SRInspection, WorkInProgress, ItemDescription, QuantityReceived, QuantityDefective, IsNonConforming, Details, ProductID, QualityStatus, LastModified, NCRFormID);
        if (result.changes > 0) {
            res.status(200).send("Quality record updated successfully!");
        } else {
            res.status(404).send("Quality record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update quality record.");
    }
});

// Endpoint to get an Engineer table by ID
app.get('/engineer/:id', (req, res) => {
    const { id } = req.params;
    try {
        const row = db.prepare('SELECT * FROM Engineer WHERE NCRFormID = ?').get(id);
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
app.post('/engineer/:NCRFormID', (req, res) => {
    const { NCRFormID } = req.params;
    const { Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, EngineerStatus } = req.body;
    try {
        const LastModified = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0];
        const stmt = db.prepare('INSERT INTO Engineer (NCRFormID, Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, EngineerStatus, LastModified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const newEngineer = stmt.run(NCRFormID, Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, EngineerStatus, LastModified);
        res.json({form: newEngineer });
        //res.status(200).send("Engineer record inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert engineer record.");
    }
});

// Endpoint to update a specific record in the Engineer table by ID
app.put('/engineer/:NCRFormID', (req, res) => {
    const { NCRFormID } = req.params;
    const { Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate } = req.body;
    try {
        const LastModified = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0];
        const stmt = db.prepare('UPDATE Engineer SET Review = ?, NotifyCustomer = ?, Disposition = ?, RevisionNumber = ?, RevisionDate = ?, LastModified = ? WHERE NCRFormID = ?');
        const result = stmt.run(Review, NotifyCustomer, Disposition, RevisionNumber, RevisionDate, LastModified, NCRFormID);
        if (result.changes > 0) {
            res.status(200).send("Engineer record updated successfully!");
        } else {
            res.status(404).send("Engineer record not found.");
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update engineer record.");
    }
});

// Endpoint to get the single most recent NCRFormID
app.get('/recent-ncr', (req, res) => {
    try {
        const row = db.prepare('SELECT id FROM NCRForm ORDER BY creationDate DESC LIMIT 1').get();
        res.json(row);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch recent NCRFormID.");
    }
});


// Endpoint to get data from the NCRform table, quality table and supplier table for the NCRs page
app.get('/SummaryInfo', (req, res) => {
    try {
        const rows = db.prepare('SELECT NCRForm.id, NCRForm.CreationDate, NCRForm.LastModified, NCRForm.FormStatus, Quality.NCRNumber, Supplier.SupplierName FROM NCRForm JOIN Quality ON NCRForm.id = Quality.NCRFormID JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id').all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// app to get summary data filtered by supplier number, status, and date range
app.get('/FilterSummaryInfo', (req, res) => {
    const { supplierFilter, status, date1, date2 } = req.query;
    try {
        const statusWild = `%${status}%`
        const supplierWildcards = `%${supplierFilter}%`;
        const rows = db.prepare('SELECT NCRForm.id, NCRForm.CreationDate, NCRForm.LastModified, NCRForm.FormStatus, Quality.NCRNumber, Supplier.SupplierName FROM NCRForm JOIN Quality ON NCRForm.id = Quality.NCRFormID JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id WHERE Supplier.SupplierName LIKE ? AND NCRForm.FormStatus LIKE ? AND NCRForm.LastModified BETWEEN ? AND ?').all(supplierWildcards, statusWild, date1, date2);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get all NCR data given an id
app.get('/AllInfo', (req, res) => {
    const { id } = req.query;
    try {
        //const rows = db.prepare('SELECT * FROM NCRForm JOIN Quality ON NCRForm.id = Quality.NCRFormID JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id JOIN Engineer ON NCRForm.id = Engineer.NCRFormID').all();
        const rows = db.prepare('SELECT * FROM NCRForm JOIN Quality ON Quality.NCRFormID = NCRForm.id JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id JOIN Engineer ON NCRForm.id = Engineer.NCRFormID WHERE NCRForm.id = ?').all(id);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get NCR data sorted by a field ASCENDING
app.get('SortAsc'), (req, res) => {
    const {sortfield} = req.query;
    try {
        const rows = db.prepare('SELECT NCRForm.id, NCRForm.CreationDate, NCRForm.LastModified, NCRForm.FormStatus, Quality.NCRNumber, Supplier.SupplierName FROM NCRForm JOIN Quality ON NCRForm.id = Quality.NCRFormID JOIN Product ON Quality.ProductID = Product.id JOIN Supplier ON Product.SupplierID = Supplier.id WHERE ').all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
}

// Endpoint to update status on NCRForm
app.put('/UpdateNCRStatus', (req, res) => {
    const { newStatus, id  } = req.query;
    try {
        const stmt = db.prepare('UPDATE NCRForm SET FormStatus = ? WHERE id = ?');
        const result = stmt.run(newStatus, id);
        if (result.changes > 0) {
            res.status(200).send("NCR record updated successfully!");
        } else {
            res.status(404).send("NCR record not found.");
        }
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update NCR form record.");
    }
});

// Endpoint to update status on Quality
app.put('/UpdateQAStatus', (req, res) => {
    const { newStatus, id  } = req.query;
    try {
        const stmt = db.prepare('UPDATE Quality SET QualityStatus = ? WHERE NCRFormID = ?');
        const result = stmt.run(newStatus, id);
        if (result.changes > 0) {
            res.status(200).send("Quality Assurance record updated successfully!");
        } else {
            res.status(404).send("Quality Assurance record not found.");
        }
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Quality Assurance to update NCR form record.");
    }
});

// Endpoint to update status on Engineer
app.put('/UpdateEngineerStatus', (req, res) => {
    const { newStatus, id  } = req.query;
    try {
        const stmt = db.prepare('UPDATE Engineer SET EngineerStatus = ? WHERE NCRFormID = ?');
        const result = stmt.run(newStatus, id);
        if (result.changes > 0) {
            res.status(200).send("Engineer record updated successfully!");
        } else {
            res.status(404).send("Engineer record not found.");
        }
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update NCR form record.");
    }
});

// Endpoint to get NCR by id
app.get('/ncrFromID', (req, res) => {
    const { ncrID } = req.query;
    try {
        const rows = db.prepare('SELECT * FROM NCRForm WHERE NCRForm.id = ?').all(ncrID);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get Quality by NCRFormID
app.get('/QualityFromNCR', (req, res) => {
    const { ncrID } = req.query;
    try {
        const rows = db.prepare('SELECT * FROM Quality WHERE Quality.NCRFormID = ?').all(ncrID);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get Engineer by NCRFormID
app.get('/EngineerFromNCR', (req, res) => {
    const { ncrID } = req.query;
    try {
        const rows = db.prepare('SELECT * FROM Engineer WHERE Engineer.NCRFormID = ?').all(ncrID);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to get the 5 most recent NCR forms
app.get('/recent-ncrs', (req, res) => {
    try {
        // Query to get the 5 most recent NCR forms ordered by LastModified
        const rows = db.prepare(`
            SELECT NCRForm.id, NCRForm.CreationDate, NCRForm.LastModified, NCRForm.FormStatus, Quality.NCRNumber, Supplier.SupplierName
            FROM NCRForm
            JOIN Quality ON NCRForm.id = Quality.NCRFormID
            JOIN Product ON Quality.ProductID = Product.id
            JOIN Supplier ON Product.SupplierID = Supplier.id
            ORDER BY NCRForm.LastModified DESC
            LIMIT 5
        `).all();

        // Send the result as JSON
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