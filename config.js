/*
  CONFIGURACIÓN DE LA GALERÍA

  Cloudinary:
  - Cloud name: koib4oby
  - Upload preset: mis15_fotos
  - El preset debe ser UNSIGNED.

  IMPORTANTE:
  Para que la galería pueda descubrir las fotos desde GitHub Pages
  sin exponer una API secreta, Cloudinary debe tener habilitado
  "Resource list" y las fotos deben llevar el tag configurado abajo.

  En tu Upload Preset agrega el tag:
      cumple

  Después de habilitar Resource list, las fotos estarán disponibles
  mediante:
      https://res.cloudinary.com/koib4oby/image/list/cumple.json
*/

const CLOUDINARY_CLOUD_NAME = "kolb4oby";
const CLOUDINARY_UPLOAD_PRESET = "mis15_fotos";

/* Tag público usado para listar las fotos. */
const CLOUDINARY_TAG = "cumple";
