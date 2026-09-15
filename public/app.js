const loginForm = document.getElementById("loginForm");

const resultado = document.getElementById("resultado");

loginForm.addEventListener(
  "submit",

  async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();

    const password = document.getElementById("password").value;

    resultado.innerHTML = `
            <div class="loading-message">
                ⏳ Verificando credenciales...
            </div>
        `;

    try {
      const respuesta = await fetch("/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,

          password,
        }),
      });

      const datos = await respuesta.json();

      /* ==========
               LOGIN CORRECTO
            ========== */

      if (respuesta.ok) {
        resultado.innerHTML = `
                    <div class="success-message">
                        ✅ Bienvenido <strong>${datos.usuario}</strong>
                        <br>
                        Redirigiendo al módulo de criptografía...
                    </div>
                `;

        setTimeout(() => {
          window.location.href = "/criptografia.html";
        }, 2000);

        return;
      }

      /* ==========
               ERRORES
            ========== */

      resultado.innerHTML = `
                <div class="error-message">
                    ❌ ${datos.error}
                </div>
            `;
    } catch (error) {
      resultado.innerHTML = `
                <div class="error-message">
                    🚫 No fue posible conectarse con el servidor.
                </div>
            `;
    }
  },
);

/* ==========================
   MOSTRAR CONTRASEÑA
========================== */

const togglePassword = document.getElementById("togglePassword");

const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});
