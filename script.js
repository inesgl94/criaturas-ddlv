async function cargarCriaturas() {
  const respuesta = await fetch('criaturas.json');
  const criaturas = await respuesta.json();
  return criaturas;
}

function obtenerDiaActual() {
  const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const ahora = new Date();
  return dias[ahora.getDay()];
}

function obtenerMinutosActuales() {
  const ahora = new Date();
  return ahora.getHours() * 60 + ahora.getMinutes();
}

function estaActivaAhora(criatura, diaActual, minutosActuales) {
  const horarios = criatura.apariciones[diaActual];
  if (!horarios) return false;

  return horarios.some(horario => {
    const [inicio, fin] = horario.split("-");
    const [hIni, mIni] = inicio.split(":").map(Number);
    const [hFin, mFin] = fin.split(":").map(Number);
    const minInicio = hIni * 60 + mIni;
    const minFin = hFin * 60 + mFin;

    return minutosActuales >= minInicio && minutosActuales <= minFin;
  });
}

async function mostrarActivas() {
  const criaturas = await cargarCriaturas();
  const lista = document.getElementById("lista-criaturas");
  lista.innerHTML = "";

  const diaActual = obtenerDiaActual();
  const minutosActuales = obtenerMinutosActuales();

  const activas = criaturas.filter(c => estaActivaAhora(c, diaActual, minutosActuales));

  if (activas.length === 0) {
    lista.innerHTML = "<li>No hay criaturas activas ahora.</li>";
  } else {
    activas.forEach(c => {
const div = document.createElement("div");
div.className = "criatura";

// Convertir nombre a slug para el nombre de archivo
const slug = c.nombre
.toLowerCase()
.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // elimina acentos
.replace(/[^a-z0-9 ]/g, "") // elimina símbolos
.replace(/\s+/g, "-"); // reemplaza espacios por guiones

const img = document.createElement("img");
img.src = `imagenes/${slug}.png`;
img.alt = c.nombre;

const p = document.createElement("p");
p.textContent = c.nombre;

div.appendChild(img);
div.appendChild(p);
lista.appendChild(div);
});

  }
}

mostrarActivas();
setInterval(mostrarActivas, 60000); // actualiza cada minuto