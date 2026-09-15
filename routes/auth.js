const express = require("express");

const bcrypt = require("bcrypt");

const router = express.Router();

module.exports = (db) => {
  router.post(
    "/login",

    async (req, res) => {
      try {
        const { username, password } = req.body;

        db.query(
          `SELECT *
                     FROM usuarios
                     WHERE username = ?`,

          [username],

          async (err, results) => {
            if (err) {
              return res.status(500).json(err);
            }

            if (results.length === 0) {
              return res.status(401).json({
                error: "Usuario no encontrado",
              });
            }

            const usuario = results[0];

            const valido = await bcrypt.compare(
              password,

              usuario.password_hash,
            );

            if (!valido) {
              return res.status(401).json({
                error: "Contraseña incorrecta",
              });
            }

            return res.json({
              mensaje: "Login correcto",

              usuario: usuario.username,

              rol: usuario.rol_id,
            });
          },
        );
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  );

  return router;
};
