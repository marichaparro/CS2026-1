require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.static("public"));

const db = mysql.createConnection({
  host: process.env.DB_HOST,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a MariaDB:", err);

    return;
  }

  console.log("✅ Conectado a MariaDB");
});

const authRoutes = require("./routes/auth")(db);

app.use("/", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${process.env.PORT}`);
});
