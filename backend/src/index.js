import express from "express";
import mysql from "mysql";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors()); // Allow Vite frontend

const port = process.env.PORT || 8080; 
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get("/", function(req, res, next) {
  //Random table to make sure that db connection is working 
  db.query('SELECT * FROM cats;', function (err, results) {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error feing data from database",   msg: err});
    }
    // Return the results as JSON in the response
    res.json({ message: `Hello from MyWORLD`, cats: results });
  });
  // res.json({message: "hello world"})
   
});

app.listen(port, () => console.log(`Listening on port ${port}\n\n`));