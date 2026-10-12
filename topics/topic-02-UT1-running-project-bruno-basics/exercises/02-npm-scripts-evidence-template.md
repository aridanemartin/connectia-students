# Ejecutar los scripts de npm — Actividad 2

## Para qué sirve esta actividad

`npm install`, `npm run dev` y `npm run build` son los tres comandos que
van a ejecutar **todas los topics** del curso, empezando por la que viene
(Topic 03), cuando el backend ya sea vuestro. Este topic los practicaran
sobre un proyecto sobre el que no habría que hacer nada: si algo falla, el problema
está en el entorno (Node, npm, permisos), no en el código.

## Pasos

```bash
cd topics/topic-02-UT1-running-project-bruno-basics/code/backend
cp .env.example .env
npm install
npm run typecheck
npm run build
npm run dev
```

Deja `npm run dev` corriendo en esa terminal — lo necesitarás para las
Actividades 3 a 5. Abre una terminal **nueva** para seguir trabajando.

## Apuntes: qué hace cada comando

| Comando | Qué hace | Cuándo lo usarás |
|---------|----------|------------------|
| `npm install` | Lee `package.json` y descarga las dependencias a `node_modules/` | La primera vez que abres un proyecto, o cuando cambian las dependencias |
| `npm run typecheck` | Comprueba los tipos de TypeScript sin generar ficheros | Antes de un commit, para detectar errores de tipo rápido |
| `npm run build` | Compila `src/*.ts` → `dist/*.js` | Antes de `npm start`, o para simular producción |
| `npm run dev` | Arranca el servidor **desde el código fuente**, con recarga automática al guardar cambios | Durante el desarrollo del día a día |

`npm run dev` **no** compila a `dist/`: ejecuta el TypeScript directamente
mediante una herramienta (`tsx`) que lo transforma en memoria. Es más
rápido para trabajar, pero no es lo que se despliega en producción — para
eso está `npm run build` seguido de `npm start`.