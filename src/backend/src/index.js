import express from "express";
import mysql from "mysql";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors()); // Allow Vite frontend


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const port = process.env.PORT || 8080; 


app.get(
  "/",
    (req, res, ) => {
      res.status(200).send({ message: "Hello world!!" });}
);

app.listen(port, () => console.log(`Listening on port ${port}`));