const express = require("express");
const bcrypt = require("bcrypt");

const bruteForce = require("../middleware/bruteForce");

const router = express.Router();

module.exports = (db) => {
  /* ======================
       RUTA DE PRUEBA
    ====================== */

  router.get("/prueba", (req, res) => {
    res.send("FUNCIONA");
  });

  /* ======================
       LOGIN
    ====================== */

  router.post(
    "/login",

    bruteForce,

    async (req, res) => {
      try {
        const { username, password } = req.body;

        db.query(
          `
                    SELECT *
                    FROM usuarios
                    WHERE username = ?
                    `,

          [username],

          async (err, results) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                error: "Error interno del servidor",
              });
            }

            /* ==========
                           USUARIO NO EXISTE
                        ========== */

            if (results.length === 0) {
              req.registroIP.conteo++;

              return res.status(401).json({
                error: "Usuario no encontrado",
              });
            }

            const usuario = results[0];

            /* ==========
                           VALIDAR PASSWORD
                        ========== */

            const valido = await bcrypt.compare(
              password,

              usuario.password_hash,
            );

            if (!valido) {
              req.registroIP.conteo++;

              if (req.registroIP.conteo >= req.MAX_INTENTOS) {
                req.registroIP.bloqueadoHasta = Date.now() + req.TIEMPO_BLOQUEO;

                return res.status(429).json({
                  error:
                    "Demasiados intentos fallidos. IP bloqueada temporalmente.",
                });
              }

              return res.status(401).json({
                error: "Contraseña incorrecta",
              });
            }

            /* ==========
                           LOGIN EXITOSO
                        ========== */

            req.registroIP.conteo = 0;

            req.registroIP.bloqueadoHasta = 0;

            return res.json({
              mensaje: "Login correcto",

              usuario: usuario.username,

              rol: usuario.rol_id,
            });
          },
        );
      } catch (error) {
        console.error(error);

        return res.status(500).json({
          error: "Error interno",
        });
      }
    },
  );

  return router;
};
