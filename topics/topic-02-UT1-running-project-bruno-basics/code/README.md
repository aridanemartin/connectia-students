# Demo backend + Bruno collection — Semana 02

Este directorio contiene material **ya construido** por el profesorado.
El alumnado lo ejecuta y lo prueba; no lo escribe. Construir una aplicación
Node.js + TypeScript + Express propia empieza en la
[Semana 03](../../topic-03-UT3-typescript-express-setup/).

## Estructura

```text
code/
├── backend/     # Demo Node.js + TypeScript + Express (2 endpoints)
└── bruno/       # Colección Bruno ya lista, apunta al demo backend
```

## Prerrequisitos

- Node.js ≥ 20 LTS (`node --version`)
- npm ≥ 10 (`npm --version`)
- La aplicación de escritorio [Bruno](https://www.usebruno.com/downloads)
  instalada (gratuita)

## Ejecutar el demo backend

```bash
cd topics/topic-02-UT1-running-project-bruno-basics/code/backend
cp .env.example .env
npm install
npm run dev
```

Salida esperada:

```text
> topic-02-demo-backend@1.0.0 dev
> tsx watch src/server.ts

Connectia Week 02 demo backend listening on http://localhost:3000
```

En otra terminal:

```bash
curl -sS -i http://localhost:3000/health
curl -sS -i "http://localhost:3000/hello?name=Ada"
```

## Abrir la colección de Bruno

1. Abre la aplicación Bruno.
2. "Open Collection" → selecciona la carpeta
   `topics/topic-02-UT1-running-project-bruno-basics/code/bruno/`.
3. Selecciona el entorno **local** (arriba a la derecha) — define
   `baseUrl = http://localhost:3000`.
4. Con el demo backend corriendo, ejecuta cada petición (`01-health`,
   `02-hello-default`, `03-hello-with-name`, `04-not-found-demo`) y observa
   estado, cabeceras y cuerpo de la respuesta.

También puedes ejecutar la colección completa desde la terminal con la CLI
oficial de Bruno (usada por el profesorado para verificar este material):

```bash
cd topics/topic-02-UT1-running-project-bruno-basics/code/bruno
npx @usebruno/cli run --env local
```

## Verificación

Para la lista de items que el alumnado debe conocer al superar esta semana, ver
[`../syllabus/README.md`](../syllabus/README.md).
