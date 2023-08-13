const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Middleware
app.use(express.json());

// Create a new SQLite database in-memory
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

// Create Event table
db.run(`CREATE TABLE Event (id INT PRIMARY KEY, name TEXT, date TEXT)`);

// Routes
app.get('/events', (req, res) => {
    db.all('SELECT * FROM Event', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.post('/events', (req, res) => {
    const { name, date } = req.body;
    db.run(`INSERT INTO Event(name, date) VALUES(?, ?)`, [name, date], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.json({ id: this.lastID, name, date });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
