import Database from 'better-sqlite3';
const db = new Database('./db/test_data.db');

// const query = `
//     CREATE TABLE IF NOT EXISTS test (
//     id INTEGER PRIMARY KEY,
//     column1 STRING NOT NULL,
//     column2 STRING NOT NULL
// )
// `;

// db.exec(query);

// const data = [
//     { column1: 'Hello', column2: 'World' },
//     { column1: 'Foo', column2: 'Bar' },
//     { column1: 'Baz', column2: 'Qux' }
// ];

// const insertData = db.prepare('INSERT INTO test (column1, column2) VALUES (@column1, @column2)');

// data.forEach((row) => {
//     insertData.run(row);
// })

// const rows = db.prepare(`SELECT * FROM test`).all();

// const row = db.prepare(`SELECT * FROM test WHERE id = ?`).get(1);

// console.log(row);

// console.log(rows);

// db.close();

import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();
const port = 5500;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(cors()); // not entirely sure what this does

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to fetch records
app.get('/records', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM test').all();
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

// Endpoint to insert data
app.post('/insert', (req, res) => {
    const { id, column1, column2 } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO test (id, column1, column2) VALUES (?, ?, ?)');
        stmt.run(id, column1, column2);
        res.status(200).send("Data inserted successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to insert data.");
    }
});

// Endpoint to update data
app.post('/update', (req, res) => {
    const { id, column1, column2 } = req.body;
    try {
        const stmt = db.prepare('UPDATE test SET column1 = ?, column2 = ? WHERE id = ?');
        stmt.run(column1, column2, id);
        res.status(200).send("Data updated successfully!");
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update data.");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});