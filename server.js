require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");

const app = express();

/* ==========================
   MIDDLEWARES
========================== */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.static("public"));

/* ==========================
   CONEXION MARIADB
========================== */

const db = mysql.createConnection({
  host: process.env.DB_HOST,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a MariaDB:", err);

    return;
  }

  console.log("✅ Conectado a MariaDB");
});

/* ==========================
   RUTAS
========================== */

const authRoutes = require("./routes/auth")(db);

console.log("✅ Auth cargado");

app.use("/", authRoutes);

/* ==========================
   RUTA HOME OPCIONAL
========================== */

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

/* ==========================
   INICIAR SERVIDOR
========================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
});
