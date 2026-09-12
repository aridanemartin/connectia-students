# Instalar Bruno y abrir la colección — Actividad 3

> Plantilla para la Actividad 3. Copia este fichero a tu repositorio de
> equipo como
> `team-docs/week-02/03-bruno-install-and-collection.md` y
> rellena cada sección.

## Team

`<Nombre del equipo>`

## Para qué sirve esta actividad

[Bruno](https://www.usebruno.com/) es un cliente de API gratuito y de
código abierto: sirve para enviar peticiones HTTP a un servidor y examinar
la respuesta sin escribir código. Es la herramienta que usaréis durante
todo el curso para probar vuestros propios endpoints antes de conectarlos a
un frontend o a otro servicio. A diferencia de otras herramientas
similares, las colecciones de Bruno son ficheros de texto plano (`.bru`)
que se versionan en Git junto al código — por eso el demo de esta semana ya
incluye una colección lista para usar.

## Pasos

1. Descarga e instala Bruno desde
   [usebruno.com/downloads](https://www.usebruno.com/downloads) (Windows,
   macOS o Linux).
2. Abre Bruno. En la pantalla de inicio, elige **"Open Collection"**.
3. Selecciona la carpeta
   `topics/topic-02-UT1-running-project-bruno-basics/code/bruno/`.
4. La colección "Connectia Week 02 Demo" aparece en el panel lateral, con
   cuatro peticiones: `01-health`, `02-hello-default`, `03-hello-with-name`
   y `04-not-found-demo`.
5. En la esquina superior derecha, selecciona el entorno **local** (define
   `baseUrl = http://localhost:3000`).
6. Confirma que el demo backend de la Actividad 2 sigue corriendo
   (`npm run dev`, en su propia terminal).
