const intentos = new Map();

function bruteForce(req, res, next) {
  const ip = req.ip;

  const ahora = Date.now();

  const MAX_INTENTOS = 5;

  const TIEMPO_BLOQUEO = 5 * 60 * 1000;

  if (!intentos.has(ip)) {
    intentos.set(ip, {
      cantidad: 0,

      bloqueadoHasta: 0,
    });
  }

  const registro = intentos.get(ip);

  if (ahora < registro.bloqueadoHasta) {
    return res.status(429).json({
      error: "IP bloqueada temporalmente",
    });
  }

  req.registroIP = registro;

  req.MAX_INTENTOS = MAX_INTENTOS;

  req.TIEMPO_BLOQUEO = TIEMPO_BLOQUEO;

  next();
}

module.exports = bruteForce;
