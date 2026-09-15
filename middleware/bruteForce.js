const intentosIP = new Map();

function bruteForce(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;

  const ahora = Date.now();

  const MAX_INTENTOS = 5;

  const TIEMPO_BLOQUEO = 15 * 60 * 1000; // 15 minutos

  if (!intentosIP.has(ip)) {
    intentosIP.set(ip, {
      conteo: 0,

      bloqueadoHasta: 0,
    });
  }

  const registro = intentosIP.get(ip);

  /* ======================
       IP BLOQUEADA
    ====================== */

  if (registro.bloqueadoHasta > ahora) {
    const segundosRestantes = Math.ceil(
      (registro.bloqueadoHasta - ahora) / 1000,
    );

    return res.status(429).json({
      error: `Demasiados intentos fallidos. IP bloqueada temporalmente. Inténtelo nuevamente en ${segundosRestantes} segundos.`,
    });
  }

  /* ======================
       RESETEAR VENTANA
    ====================== */

  if (registro.bloqueadoHasta !== 0 && ahora > registro.bloqueadoHasta) {
    registro.conteo = 0;

    registro.bloqueadoHasta = 0;
  }

  req.registroIP = registro;

  req.MAX_INTENTOS = MAX_INTENTOS;

  req.TIEMPO_BLOQUEO = TIEMPO_BLOQUEO;

  next();
}

module.exports = bruteForce;
