const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

/* DATABASE */

const db = new sqlite3.Database("./expenses.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to SQLite database.");
});

/* CREATE TABLE */

db.run(`
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  amount INTEGER,
  category TEXT,
  type TEXT
)
`);

/* GET ALL EXPENSES */

app.get("/expenses", (req, res) => {
  db.all("SELECT * FROM expenses", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

/* ADD EXPENSE */

app.post("/expenses", (req, res) => {

  const { title, amount, category, type } = req.body;

  const sql =
    "INSERT INTO expenses (title, amount, category, type) VALUES (?,?,?,?)";

  db.run(sql, [title, amount, category, type], function (err) {

    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      id: this.lastID,
      title,
      amount,
      category,
      type
    });

  });

});

/* DELETE EXPENSE */

app.delete("/expenses/:id", (req, res) => {

  const id = req.params.id;

  db.run("DELETE FROM expenses WHERE id=?", id, function (err) {

    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({ message: "Deleted successfully" });

  });

});

/* SERVER */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});