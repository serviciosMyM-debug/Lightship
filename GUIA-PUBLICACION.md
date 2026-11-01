# Lightship — sitio y panel privado

## Publicación

Repositorio: https://github.com/serviciosMyM-debug/Lightship. Vercel compila el proyecto con `npm ci` y `npm run build`; la salida estática queda en `public/` y las funciones están en `api/`. El archivo `vercel.json` configura la compilación. Para desarrollo, ejecutá `npm install`, `npm test` y `npm run build`.

La página conserva una galería base local con las fotografías y el video suministrados. El video de la carpeta de noviembre se publicó sin pista de audio. Se omitió una copia idéntica de una fotografía; las demás se optimizaron para la web.

## Acceso del cliente

Dirección: https://www.lightship.com.ar/admin
Usuario: nicolas
La contraseña se entrega por separado, en un archivo privado local. Nunca agregar credenciales al repositorio.

El cliente puede seleccionar varios archivos del celular, agregar un título y una descripción y publicarlos. Cada video se procesa para quitar físicamente su audio antes de mostrarse al público. También puede corregir textos, ocultar y volver a mostrar registros. Ocultar no borra archivos.

Formatos: fotos JPG, PNG y WebP; videos MP4, MOV y WebM. Límite: 60 MB por archivo. Los videos cortos se procesan con mayor rapidez; una carga que no pueda completarse no se publica. El procesamiento de cada archivo tiene un tiempo máximo de ejecución. Si un video largo no termina, preparar una versión más corta. Mantener el panel abierto hasta que termine cada carga.

La sesión dura 8 horas. Hay un límite de intentos de acceso. La sesión se guarda en una cookie segura, inaccesible a JavaScript; el servidor verifica usuario y contraseña. El panel no permite cambios públicos sin autenticarse.

## Almacenamiento

El proyecto necesita un almacén Vercel Blob **privado**, dedicado a Lightship. Los originales entran a `incoming/`; solamente los archivos procesados y registrados en `records/` se sirven por la API pública. Un archivo original no aparece en la galería. Al completar el procesamiento, se retira el original. Si una carga falla, el original puede quedar en el espacio privado y no se publica. Los archivos procesados están en `media/`.

Vercel debe conectar `BLOB_READ_WRITE_TOKEN` al servidor. Los otros valores son `LIGHTSHIP_ADMIN_USER`, `LIGHTSHIP_ADMIN_PASSWORD_HASH` y `LIGHTSHIP_SESSION_SECRET`. No tienen prefijo público ni se incluyen en los archivos del navegador. El hash de la contraseña usa scrypt. La clave de sesión es aleatoria. Después de modificar las variables del servidor se necesita un nuevo despliegue para aplicarlas.

El panel aparece como pendiente de activación hasta tener configurados los valores necesarios. El sitio público sigue mostrando la galería local si el almacén no está disponible. Las actualizaciones del contenido pueden tardar hasta unos segundos por caché.

## Respaldo

GitHub conserva los archivos de la web y la galería base. El contenido que el cliente sube desde el panel se guarda en Blob y no genera commits de GitHub. Respaldar ese almacenamiento por separado si se requiere una copia externa.

El ZIP del proyecto incluye código fuente, configuración y archivos locales. Excluye dependencias instaladas y credenciales. Para reconstruirlo se necesita ejecutar `npm install` y `npm run build`.

## Video y privacidad

El video base entregado se verificó sin ninguna pista de audio. Los futuros videos pasan por un procesamiento privado antes de publicarse: se conserva únicamente video, se convierte a MP4 compatible y se genera una portada. Un botón de silenciar por sí solo no reemplaza ese proceso.

## Identidad y presentación

Modo oscuro inicial y selector claro/oscuro con preferencia persistente. Firma fija “Hecho por Servicios MyM”, con los logos originales locales, enlace oficial y espacio para el área segura del celular. La firma permanece visible en el acceso privado y los modales.

La portada alterna fotos de la flota con controles de pausa y navegación. Los bloques aparecen y desaparecen según el desplazamiento. Los efectos respetan la preferencia de movimiento reducido.

## Contacto

El formulario público prepara una consulta en WhatsApp; el visitante confirma su envío allí. Los contactos, los servicios y los datos de flota provienen del portfolio proporcionado. El panel de contenidos no modifica los contactos ni las dimensiones de las embarcaciones.
