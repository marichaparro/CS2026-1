const ALFABETO = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
const MOD = 27;

/* ==========================
   NORMALIZAR
========================== */

function normalizarTexto(texto) {
  return texto
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-ZÑ]/g, "");
}

/* ==========================
   CESAR
========================== */

function cifrarCesar(texto, k) {
  let resultado = "";

  for (let letra of texto) {
    let pos = ALFABETO.indexOf(letra);

    if (pos === -1) continue;

    resultado += ALFABETO[(pos + k) % MOD];
  }

  return resultado;
}

function descifrarCesar(texto, k) {
  let resultado = "";

  for (let letra of texto) {
    let pos = ALFABETO.indexOf(letra);

    if (pos === -1) continue;

    resultado += ALFABETO[(pos - k + MOD) % MOD];
  }

  return resultado;
}

function fuerzaBrutaCesar(texto) {
  let html = "<h3>Ataque César (Fuerza Bruta)</h3>";

  for (let k = 0; k < 27; k++) {
    html += `
        <details>
            <summary>Clave ${k}</summary>

            <pre>${descifrarCesar(texto, k)}</pre>
        </details>
        `;
  }

  return html;
}

function encontrarMejorCesar(texto) {
  const letrasFrecuentes = ["E", "A", "O", "S", "N"];
  const freq = contarFrecuencias(texto);
  const masFrecuente = obtenerLetraMasFrecuente(freq);

  let resultados = [];

  for (let letra of letrasFrecuentes) {
    let clave = ALFABETO.indexOf(masFrecuente) - ALFABETO.indexOf(letra);

    if (clave < 0) {
      clave += MOD;
    }

    resultados.push({
      clave: clave,
      texto: descifrarCesar(texto, clave),
    });
  }

  return resultados;
}

/* ==========================
   AFIN
========================== */

function cifrarAfin(texto, a, b) {
  let resultado = "";

  for (let letra of texto) {
    let pos = ALFABETO.indexOf(letra);
    let nuevo = (a * pos + b) % 27;
    resultado += ALFABETO[nuevo];
  }

  return resultado;
}

function inversoModular(a, m) {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }

  return null;
}

function descifrarAfin(texto, a, b) {
  let resultado = "";
  const inverso = inversoModular(a, 27);

  if (inverso === null) {
    return "";
  }

  for (let letra of texto) {
    let pos = ALFABETO.indexOf(letra);
    let nuevo = (inverso * (pos - b + 27)) % 27;
    resultado += ALFABETO[nuevo];
  }

  return resultado;
}

function ataqueAfin(texto) {
  let html = "<h3>Ataque Afín</h3>";
  let coprimos = [
    1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26,
  ];
  let contador = 0;

  for (let a of coprimos) {
    for (let b = 0; b < 27; b++) {
      contador++;

      if (contador > 40) {
        break;
      }

      html += `
            <details>
                <summary>a=${a} b=${b}</summary>
                <pre>${descifrarAfin(texto, a, b)}</pre>
            </details>
            `;
    }
  }

  return html;
}

function mejoresAfin(texto) {
  let html = "<h3>Posibles Resultados Afín</h3>";
  const claves = [
    [5, 7],
    [7, 3],
    [11, 8],
    [2, 5],
  ];

  claves.forEach((c) => {
    html += `
        <details>
            <summary>a=${c[0]} b=${c[1]}</summary>
            <pre>${descifrarAfin(texto, c[0], c[1])}</pre>
        </details>
        `;
  });

  return html;
}

/* ==========================
   VIGENERE
========================== */

function cifrarVigenere(texto, clave) {
  texto = normalizarTexto(texto);
  clave = normalizarTexto(clave);

  let resultado = "";

  for (let i = 0; i < texto.length; i++) {
    let t = ALFABETO.indexOf(texto[i]);
    let k = ALFABETO.indexOf(clave[i % clave.length]);

    resultado += ALFABETO[(t + k) % MOD];
  }

  return resultado;
}

/* ==========================
   KASISKI
========================== */

function mcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

function kasiski(texto) {
  let html = "<h3>Método de Kasiski</h3>";
  let encontrados = [];

  for (let i = 0; i < texto.length - 3; i++) {
    let bloque = texto.substring(i, i + 3);

    for (let j = i + 3; j < texto.length - 3; j++) {
      let bloque2 = texto.substring(j, j + 3);

      if (bloque === bloque2) {
        encontrados.push({
          secuencia: bloque,
          distancia: j - i,
        });
      }
    }
  }

  if (encontrados.length === 0) {
    html += `<p>No se encontraron secuencias repetidas.</p>`;
    return html;
  }

  html += `
    <table>
        <tr>
            <th>Secuencia</th>
            <th>Distancia</th>
        </tr>
    `;

  encontrados.forEach((x) => {
    html += `
        <tr>
            <td>${x.secuencia}</td>
            <td>${x.distancia}</td>
        </tr>
        `;
  });

  html += "</table>";

  let posible = encontrados[0].distancia;

  for (let i = 1; i < encontrados.length; i++) {
    posible = mcd(posible, encontrados[i].distancia);
  }

  html += `
    <p style="margin-top: 14px;">
    <strong>Longitud probable de la clave:</strong> ${posible}
    </p>
    `;

  return html;
}

/* ==========================
   FRECUENCIAS
========================== */

function contarFrecuencias(texto) {
  let freq = {};

  for (let letra of ALFABETO) {
    freq[letra] = 0;
  }

  for (let letra of texto) {
    if (freq.hasOwnProperty(letra)) {
      freq[letra]++;
    }
  }

  return freq;
}

function obtenerLetraMasFrecuente(freq) {
  let max = 0;
  let letra = "";

  for (let l in freq) {
    if (freq[l] > max) {
      max = freq[l];
      letra = l;
    }
  }

  return letra;
}

/* ==========================
   IC
========================== */

function calcularIC(texto) {
  let freq = contarFrecuencias(texto);
  let N = texto.length;
  let suma = 0;

  for (let letra in freq) {
    suma += freq[letra] * (freq[letra] - 1);
  }

  return suma / (N * (N - 1));
}

/* ==========================
   TABLA
========================== */

function tablaFrecuencias(freq) {
  let html = "<h3>Frecuencias</h3>";

  html += `
    <table>
    <tr>
        <th>Letra</th>
        <th>Cantidad</th>
    </tr>
    `;

  for (let letra in freq) {
    html += `
        <tr>
            <td>${letra}</td>
            <td>${freq[letra]}</td>
        </tr>
        `;
  }

  html += "</table>";

  return html;
}

/* ==========================
   PRINCIPAL
========================== */

function analizar() {
  let texto = normalizarTexto(document.getElementById("texto").value);
  let modo = document.getElementById("modo").value;

  if (texto.length === 0) {
    alert("Ingrese un texto");
    return;
  }

  /* ======================
        CIFRAR
     ====================== */

  if (modo === "cifrar") {
    let algoritmo = document.getElementById("algoritmo").value;
    let clave = document.getElementById("clave").value.toUpperCase();
    let resultado = "";

    if (algoritmo === "cesar") {
      resultado = cifrarCesar(texto, parseInt(clave));
    }

    if (algoritmo === "afin") {
      let partes = clave.split(",");
      let a = parseInt(partes[0]);
      let b = parseInt(partes[1]);

      resultado = cifrarAfin(texto, a, b);
    }

    if (algoritmo === "vigenere") {
      resultado = cifrarVigenere(texto, clave);
    }

    document.getElementById("resultado").innerHTML = `
        <h2>🔒 Resultado del Cifrado</h2>
        <h3>Texto Normalizado</h3>
        <pre>${texto}</pre>
        <h3>Texto Cifrado</h3>
        <pre>${resultado}</pre>
        `;

    return;
  }

  /* ======================
        ANALISIS
     ====================== */

  let ic = calcularIC(texto);
  let freq = contarFrecuencias(texto);

  let tipo = "";
  let observacion = "";

  if (ic >= 0.06) {
    tipo = "Monoalfabético (César o Afín)";
    observacion = "Procediendo con Fuerza Bruta César y análisis Afín.";
  } else {
    tipo = "Polialfabético (Vigenère)";
    observacion = "Procediendo con Método de Kasiski.";
  }

  let letraMasFrecuente = "";
  let max = 0;

  for (let letra in freq) {
    if (freq[letra] > max) {
      max = freq[letra];
      letraMasFrecuente = letra;
    }
  }

  let html = `
<h2>🔍 Resultado del Análisis</h2>

<h3>Texto Analizado</h3>
<pre>${texto}</pre>

<p><strong>Longitud:</strong> ${texto.length}</p>
<p><strong>IC:</strong> ${ic.toFixed(5)}</p>
<p><strong>Tipo Detectado:</strong> ${tipo}</p>
<p><strong>Letra Más Frecuente:</strong> ${letraMasFrecuente} (${max} veces)</p>
<p><strong>Observación:</strong> ${observacion}</p>

${tablaFrecuencias(freq)}
`;

  if (ic >= 0.06) {
    const candidatos = encontrarMejorCesar(texto);

    html += "<h3>Posibles Descifrados César</h3>";

    candidatos.forEach((c) => {
      html += `
        <div class="resultado-caja">
          <p><strong>Clave:</strong> ${c.clave}</p>
          <pre>${c.texto}</pre>
        </div>
        `;
    });

    html += mejoresAfin(texto);
  } else {
    html += kasiski(texto);

    html += `
    <div class="resultado-caja">
      <p><strong>Posible resultado:</strong></p>
      <p>La clave debe obtenerse a partir del análisis Kasiski y luego descifrar cada columna como un César independiente.</p>
    </div>
    `;
  }

  document.getElementById("resultado").innerHTML = html;
}

/* ==========================
   INTERFAZ
========================== */

function actualizarBoton() {
  const modoSelect = document.getElementById("modo");
  const opcionesCifrado = document.getElementById("opcionesCifrado");
  const btnAccion =
    document.getElementById("btnAccion") || document.querySelector("button");

  if (!modoSelect || !opcionesCifrado || !btnAccion) return;

  if (modoSelect.value === "analizar") {
    btnAccion.innerHTML = "❀ Realizar Análisis ❀";
    opcionesCifrado.classList.remove("visible");
    opcionesCifrado.classList.add("oculto");
  } else {
    btnAccion.innerHTML = "❀ Realizar Cifrado ❀";
    opcionesCifrado.classList.remove("oculto");
    opcionesCifrado.classList.add("visible");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarBoton();
});
