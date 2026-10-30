# Lightship SRL — Web y galería

Sitio estático completo, sin instalación de paquetes ni paso de compilación. Incluye fotografías locales, portfolio PDF, flota, cobertura, contacto, galería, modo oscuro y claro y editor de contenido.

## Publicar desde GitHub y Vercel

1. Creá o elegí un repositorio para Lightship en tu cuenta de GitHub. Evitá reemplazar archivos de otro proyecto.
2. Subí el **contenido** de esta carpeta a la raíz del repositorio: `index.html`, los demás archivos y la carpeta `assets`. No subas solamente el ZIP ni una carpeta que los contenga.
3. En Vercel, importá ese repositorio. Elegí el preset **Other**. Dejá Build Command sin comando, Install Command sin comando y Output Directory en la raíz (`.`). No requiere variables de entorno.
4. Publicá y revisá el enlace que genere Vercel.
5. En Settings → Domains, agregá el dominio confirmado y seguí los registros DNS exactos que te indique Vercel. El dominio sugerido por el cliente es `lightship.com.ar`, pendiente de confirmación. Conservá los registros MX, SPF, DKIM y DMARC del correo existente.
6. Elegí el dominio principal y su redirección www según la configuración de Vercel.

Repositorio del proyecto: https://github.com/serviciosMyM-debug/Lightship. La conexión con Vercel y el dominio se verifican por separado desde la cuenta de alojamiento.

## Agregar imágenes y videos sin editar código

1. Abrí `/editor.html` desde la web publicada o desde el servidor local.
2. Cargá una imagen JPG/PNG/WebP o un video MP4/WebM. También podés pegar un enlace de YouTube o Vimeo. La portada de video es opcional.
3. Agregá título y descripción. Podés corregir textos, eliminar elementos y cambiar el orden.
4. Pulsá **Descargar web completa**. Se genera un ZIP que incluye el sitio y los archivos nuevos.
5. Descomprimí el ZIP y reemplazá los archivos correspondientes en tu repositorio. Confirmá los cambios. Vercel vuelve a publicar automáticamente cuando esté conectado a la rama correcta.

El editor guarda borradores en IndexedDB en este navegador y este dispositivo. No existe un servidor de carga ni un inicio de sesión. Un visitante puede editar su propia copia local, pero no puede cambiar el repositorio o la web pública sin acceso a GitHub. No guardes información sensible en títulos o descripciones. Un cambio del navegador, su limpieza de datos o una exportación pendiente puede perder el borrador: descargá una copia como respaldo.

El editor es una herramienta de preparación de archivos, no un CMS con publicación inmediata. Para publicación directa por varios administradores haría falta conectar un servicio con autenticación y almacenamiento.

Límites del editor: imágenes 15 MB, videos 40 MB por archivo. Para videos pesados usá YouTube o Vimeo. El proveedor del video puede impedir la reproducción incrustada o mostrar sus propios avisos; probá los enlaces antes de publicar. Los archivos exportados conservan su formato original: comprimí los videos para que carguen bien en celulares.

## Vista previa local

Podés abrir `index.html` directamente para ver la página. Para usar la exportación del editor, serví la carpeta por HTTP. Si tenés Node.js, desde la carpeta ejecutá:

```
node preview.cjs
```

Abrí `http://127.0.0.1:4173` y `http://127.0.0.1:4173/editor.html`. Cerrá el proceso con Ctrl+C al terminar.

## Contacto y contenido

Se transcribieron los contactos y servicios del portfolio de junio proporcionado: operaciones@lightship.com.ar, administracion@lightship.com.ar, +54 9 3476 597324 y +54 9 3414 680382. Confirmá que siguen vigentes antes del lanzamiento. No se inventaron certificaciones, clientes, testimonios ni estadísticas.

El formulario prepara un mensaje para WhatsApp y el visitante lo envía desde allí. No envía correos ni almacena consultas. Los correos tienen enlaces `mailto:` y los teléfonos enlaces para llamar.

Los títulos, textos y datos generales están en `index.html`. El contenido de galería está en `content.js`. Los colores y la presentación están en `styles.css`.

Las dimensiones y capacidades de la flota se tomaron del PDF; verificá su vigencia y las condiciones de cada servicio antes de la publicación definitiva. La fotografía de portada muestra LM Regina en el muelle. El símbolo del ancla se obtuvo del portfolio original; las fotos son del material suministrado. No se incorporaron fotografías de terceros.

## Indexación

Se incluyen título, descripción, idioma, encabezados, texto alternativo, metadatos sociales y `robots.txt`. La indexación no depende de conectar GitHub: ocurre después de publicar una web accesible a los buscadores. El editor solicita no ser indexado.

Cuando confirmes el dominio, agregá la URL absoluta de producción como enlace canónico y `og:url`, convertí `og:image` a su URL absoluta y creá un `sitemap.xml`. Luego podés enviar ese sitemap a Google Search Console. No se fijó un dominio no confirmado ni se garantiza una posición en los resultados.

## Preferencias y firma

Oscuro de inicio, selector claro/oscuro con elección persistente. Firma fija “Hecho por Servicios MyM”, logos originales locales y enlace a serviciosmym.com.ar. El sitio reserva espacio inferior y área segura móvil. La firma permanece visible también con la galería abierta y en el editor.

## Archivos

`files.json` enumera los archivos necesarios para la exportación del editor. Incluye copias de los archivos de configuración y de la guía, porque algunos alojamientos no sirven esos archivos por HTTP. Si los modificás manualmente, sincronizá también sus copias en `files.json`; si agregás archivos al proyecto, agregalos a la lista `files`. La biblioteca JSZip se incluye localmente y conserva su licencia en su encabezado (MIT/GPL dual).
