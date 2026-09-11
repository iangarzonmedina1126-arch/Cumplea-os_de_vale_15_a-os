const uploadUrl =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const listUrl =
  `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/list/${CLOUDINARY_TAG}.json`;

const selector = document.getElementById("selectorFotos");
const galeria = document.getElementById("galeria");
const estado = document.getElementById("estado");

selector.addEventListener("change", async () => {
  const archivos = Array.from(selector.files || []);
  if (!archivos.length) return;

  estado.textContent = `Subiendo ${archivos.length} foto(s)...`;

  let subidas = 0;
  let errores = 0;

  for (const archivo of archivos) {
    try {
      if (!archivo.type.startsWith("image/")) continue;

      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("tags", CLOUDINARY_TAG);

      const respuesta = await fetch(uploadUrl, {
        method: "POST",
        body: formData
      });

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`);
      }

      subidas++;
    } catch (error) {
      console.error("Error subiendo:", error);
      errores++;
    }
  }

  selector.value = "";

  if (errores) {
    estado.textContent =
      `Se subieron ${subidas} foto(s). ${errores} no pudieron subirse.`;
  } else {
    estado.textContent =
      `¡Listo! Se subieron ${subidas} foto(s). 🎉`;
  }

  await cargarGaleria();
});

async function cargarGaleria() {
  estado.textContent = "Cargando galería...";

  try {
    const respuesta = await fetch(`${listUrl}?t=${Date.now()}`);

    if (!respuesta.ok) {
      throw new Error(
        "No se pudo acceder al listado público de Cloudinary."
      );
    }

    const datos = await respuesta.json();

    galeria.innerHTML = "";

    const recursos = datos.resources || [];

    if (!recursos.length) {
      galeria.innerHTML =
        `<div class="vacio">Todavía no hay fotos. ¡Sé el primero en subir una! 📸</div>`;
      estado.textContent = "";
      return;
    }

    recursos.reverse().forEach(recurso => {
      const url = construirUrl(recurso);
      const imagen = document.createElement("img");

      imagen.className = "foto";
      imagen.src = url;
      imagen.alt = "Foto del cumpleaños";
      imagen.loading = "lazy";

      imagen.addEventListener("click", () => abrirModal(url));
      galeria.appendChild(imagen);
    });

    estado.textContent = `${recursos.length} foto(s) compartida(s) 🎉`;
  } catch (error) {
    console.error(error);

    galeria.innerHTML = `
      <div class="vacio">
        <strong>No se pudo cargar la galería.</strong><br><br>
        Revisa la configuración de "Resource list" y el tag
        <strong>${CLOUDINARY_TAG}</strong> en Cloudinary.
      </div>
    `;

    estado.textContent = "";
  }
}

function construirUrl(recurso) {
  const version = recurso.version ? `/v${recurso.version}` : "";
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload${version}/${recurso.public_id}.${recurso.format || "jpg"}`;
}

function abrirModal(url) {
  document.getElementById("imagenGrande").src = url;
  document.getElementById("modal").style.display = "flex";
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") cerrarModal();
});

cargarGaleria();
