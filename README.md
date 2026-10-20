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
