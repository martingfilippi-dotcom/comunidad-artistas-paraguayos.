# Comunidad de Artistas Paraguayos

Portal independiente para descubrir artistas paraguayos, conectar talentos y compartir proyectos de la escena musical.

## Accesos oficiales

- **Web pública:** https://martingfilippi-dotcom.github.io/comunidad-artistas-paraguayos./
- **Repositorio GitHub:** https://github.com/martingfilippi-dotcom/comunidad-artistas-paraguayos.
- **Web independiente de ECO Studios:** https://martingfilippi-dotcom.github.io/eco-studios/

## Alcance

Este repositorio administra exclusivamente la web de la Comunidad de Artistas Paraguayos. No debe sincronizarse con la base editorial ni con el escenario Make de ECO Studios. ECO Studios aparece aquí como enlace a un sitio independiente.

## Estructura

- `index.html`: contenido y estructura de la página.
- `styles.css`: estilos y diseño responsive.
- `paraguay-flag.svg`: bandera usada por la identidad visual.
- `youtube-*.jpg`: recursos de artistas usados por la página.
- `.github/workflows/`: despliegue de GitHub Pages.

Las imágenes referenciadas por la web se sirven ahora desde este mismo repositorio. El repositorio histórico `eco-music-web` se conserva como fuente de respaldo, pero no es necesario para cargar las imágenes de esta página.

## Publicación

El sitio usa GitHub Actions para GitHub Pages. Si el despliegue falla, comprobar **Settings → Pages → Source: GitHub Actions** y revisar la pestaña Actions.

## Pendientes conocidos

- El nombre actual del repositorio termina en punto: `comunidad-artistas-paraguayos.`. No cambiarlo sin revisar Settings → Pages y los enlaces que lo referencian; la conexión disponible no permite renombrar repositorios.
- Verificar que el último workflow de Pages termine correctamente después de los cambios.
- Mantener separados el contenido y las automatizaciones de ECO Studios.

## Mantenimiento

No eliminar recursos, perfiles ni páginas sin revisar primero si están enlazados. No guardar credenciales ni tokens en el repositorio.


## Contenido editorial para Make

La Comunidad usa **dos destinos separados** y nunca comparte el escenario ni los datos de ECO Studios:

- `data/community-artists.json`: directorio de artistas.
- `data/community-publications.json`: noticias, lanzamientos, eventos y colaboraciones.

`community-content.js` lee esos archivos y muestra solo elementos que cumplen todas estas condiciones: `status: "Publicado"`, `permissionVerified: true` y `webTarget` igual a `"Comunidad"` o `"Ambas"`. Las URLs de imágenes y enlaces externos deben ser HTTPS. El código inserta texto como texto, no como HTML, para evitar inyección de marcado.

### Campos del directorio de artistas

Cada elemento de `data/community-artists.json` usa: `id` (ID estable de página Notion), `name`, `slug`, `description`, `city`, `genres` (array de texto), `skills`, `imageUrl`, `socialLinks` (`youtube`, `spotify`, `appleMusic`, `instagram`, `tiktok`), `externalUrl`, `status`, `permissionVerified`, `webTarget` y `order`.

### Campos de publicaciones

Cada elemento de `data/community-publications.json` usa: `id` (ID estable de página Notion), `title`, `type`, `summary`, `content`, `artist`, `date`, `imageUrl`, `externalUrl`, `status`, `permissionVerified`, `webTarget` y `order`.

### Reglas obligatorias del flujo Make

1. Leer el Directorio de Artistas y Publicaciones desde sus bases de Notion propias.
2. Incluir registros ya publicados con permiso, y también los nuevos cuando estén en `Listo para publicar`, `Solicitar publicación = Sí` y `Permiso de publicación confirmado = Sí`.
3. Excluir borradores, registros sin permiso, destinos ajenos a la Comunidad y URLs no válidas.
4. Construir el array completo de registros elegibles y escribirlo en el archivo correspondiente. No sobrescribir el otro archivo ni el repositorio de ECO Studios.
5. Leer el SHA actual del archivo de destino en GitHub antes de actualizarlo. Una vez confirmado el despliegue, devolver estado y fecha a Notion; no marcar una publicación como completada antes de verificar el resultado.
6. Cuando un registro aprobado se sincronice, cambiar su estado a `Publicado` y desmarcar la solicitud, sin borrar el registro de Notion. Los registros ya publicados deben seguir entrando en el JSON en ejecuciones posteriores.
7. Probar con contenido expresamente autorizado; nunca marcar el registro técnico como publicado para probar.

Los dos archivos se inicializan vacíos para no fabricar contenido editorial. Hasta que haya al menos un perfil aprobado, el sitio conserva su directorio actual como respaldo visual. La automatización de Notion → Make → GitHub Pages sigue pendiente de configuración y prueba de extremo a extremo.
