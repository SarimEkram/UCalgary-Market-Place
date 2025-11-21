// src/index.js
import app from "./app.js";
import db from "./config/db.js"; // use app.js pool instead of creating another connection

const port = process.env.PORT || 8080;

// health-check route
app.get("/", (req, res) => {
  db.query("SELECT * FROM users;", (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ error: "Error fetching data from database", msg: err });
    }
    res.json({
      message: "Hello from the backend and the database!",
      cats: results,
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}\n\n`));
