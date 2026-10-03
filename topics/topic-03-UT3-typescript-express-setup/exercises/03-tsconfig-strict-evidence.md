# TypeScript estricto y ciclo build/start — Actividad 3

## Qué se añade en esta actividad

La Actividad 1 creó el `package.json` y el `src/server.ts`, y la Actividad 2
sacó la configuración del código al `.env`. El servidor arranca con `tsx` y
responde en `/health/live` — pero `tsx` ejecuta TypeScript sin comprobar
tipos y sin build. Esta actividad añade dos piezas:

- **`tsconfig.json`** — la configuración de TypeScript, en modo `strict`.
- **Los scripts `typecheck`, `build` y `start`** en `package.json`.

Con esto el proyecto tiene el ciclo completo
`npm install → npm run typecheck → npm run build → npm start`, y la
siguiente actividad añadirá la configuración centralizada.

> **En tu repositorio del backend**: añade `tsconfig.json` y los scripts
> `typecheck`, `build` y `start` a tu `package.json`.
>
> **Avance de vuestra API**: a partir de ahora todo incremento de la API de
> documents/questions deberá compilar en estricto y poder ejecutarse
> compilado.

## Estructura de ficheros que debes crear en esta actividad

Crea **una pieza nueva** (`tsconfig.json`) y **modifica otra**
(`package.json`). Así queda el proyecto al terminar esta actividad:

```
./   (raíz del repositorio del backend)
├── package.json     # A1: MODIFICADO en A3 — se añaden los scripts typecheck, build y start
├── tsconfig.json    # A3: NUEVO — configuración estricta de TypeScript
├── .gitignore       # A2: sin cambios (ignora node_modules/, dist/ y .env)
├── .env.example     # A2: sin cambios
└── src/
    └── server.ts    # A2: sin cambios (todavía lee el .env "a mano")
```

No se crea nada más en esta actividad: `npm run build` genera `dist/`, pero
esa es salida del compilador, no un fichero que escribas a mano (y ya está
en `.gitignore`). `config/env.ts`, `eslint.config.js`, `.prettierrc.json`,
`app.ts` y `routes/health.ts` se añaden en las Actividades 4-7.

## Apuntes: qué es TypeScript y por qué "estricto"

TypeScript es un superconjunto de JavaScript: **JavaScript con tipos**. El
navegador y Node.js **no entienden TypeScript**: ejecutan JavaScript. Por eso
existe la compilación: `tsc` (TypeScript Compiler) traduce tus `.ts` a `.js`
y, de paso, **comprueba los tipos**. Un programa TypeScript que nadie compila
es un programa del que nadie ha comprobado los tipos.

El modo `strict` activa de golpe todas las comprobaciones estrictas de
TypeScript. Las más importantes son:

- `noImplicitAny`: prohíbe tipos `any` implicados. Si declaras un parámetro
  sin tipo, TypeScript asume `any` (cualquier cosa) y con `strict` eso es
  un **error**, porque `any` desactiva la comprobación de tipos justo donde
  suele hacer más falta.
- `strictNullChecks`: `null` y `undefined` **no** son asignables
  silenciosamente a otros tipos. Con esto, un valor que puede no existir te
  obliga a comprobar si existe antes de usarlo. Evita la clase de error
  "Cannot read properties of undefined" en producción.
- Otras: `strictBindCallApply`, `strictFunctionTypes`,
  `strictPropertyInitialization`, `noImplicitThis`, `noFallthroughCasesInSwitch`,
  `useUnknownInCatchVariables`.

La idea central: **el error se detecta al compilar, no al ejecutar**. Cuanto
más estricto compiles, más errores se quedan fuera de producción. Desactivar
`strict` "porque compilaba antes" es esconder bugs, y el criterio de
aceptación de esta actividad lo deja claro.

## Apuntes: el `tsconfig.json` del proyecto, opción a opción

`tsconfig.json` es el fichero de configuración de TypeScript. El proyecto de
referencia usa este y **debéis justificar cada opción**:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "sourceMap": true,
    "declaration": false,
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

Este es un fichero con el que irás familiarizándote con el tiempo, simplemente fíjate en lo que hace cada opción para que vaya sonándote. Por ejemplo, `"strict": true` activa todas las comprobaciones estrictas de TypeScript, y `"esModuleInterop": true` permite importar módulos CommonJS con la sintaxis `import express from 'express'`.

| Opción | Qué hace |
|--------|----------|
| `"target": "ES2022"` | Versión de ECMAScript del JavaScript generado. ES2022 es compatible con Node 20+. |
| `"module": "NodeNext"` | Sistema de módulos de salida. NodeNext respeta `"type": "module"` del `package.json`: genera ESM (`import`) en lugar de CommonJS. |
| `"moduleResolution": "NodeNext"` | Cómo resuelve TypeScript los imports. Con NodeNext **obliga** a la extensión `.js` en los imports relativos. |
| `"rootDir": "./src"` | Carpeta raíz del código fuente. `tsc` solo compila lo que está bajo `src/`. |
| `"outDir": "./dist"` | Carpeta de salida del build. `src/server.ts` → `dist/server.js`. |
| `"strict": true` | Activa todas las comprobaciones estrictas (ver arriba). **No desactivar**. |
| `"esModuleInterop": true` | Permite `import express from 'express'` con módulos CommonJS. Sin esto, tendrías que escribir `import * as express`. |
| `"skipLibCheck": true` | Omite la comprobación de tipos dentro de los `.d.ts` de las dependencias (más rápido; tus propios ficheros sí se comprueban). |
| `"forceConsistentCasingInFileNames": true` | Trata `./App.ts` y `./app.ts` como ficheros distintos. Evita bugs que solo aparecen en equipos con sistemas de ficheros que no distinguen mayúsculas. |
| `"sourceMap": true` | Genera `dist/*.js.map`: al depurar, el stack trace apunta a tu `.ts` original, no al `.js` compilado. |
| `"declaration": false` | No genera ficheros `.d.ts` (no publicamos una librería). |
| `"resolveJsonModule": true` | Permite importar ficheros JSON como módulos (útil más adelante). |
| `"include": ["src/**/*.ts"]` | Qué compila: todo `.ts` bajo `src/`. |
| `"exclude": ["node_modules", "dist"]` | Qué nunca compila: dependencias y el build anterior. |

## Apuntes: typecheck vs. build vs. start

Tres scripts nuevos en `package.json`, uno a uno:

| Script | Comando real | Qué hace |
|--------|--------------|----------|
| `typecheck` | `tsc --noEmit` | Comprueba tipos **sin** escribir ficheros. Es la comprobación rápida de "¿compila esto?". |
| `build` | `tsc` | Comprueba tipos **y emite** el JavaScript en `dist/`. Genera `dist/server.js` (y el resto). |
| `start` | `node dist/server.js` | Ejecuta el *JavaScript compilado* (no TypeScript) directamente con Node. |

Los dos primeros fallan con código ≠ 0 cuando hay un error de tipo; la
diferencia es si se emite o no el código compilado.

## PARA PRODUCCIÓN
`npm start` **no compila**: es una decisión pedagógica deliberada. Ejecuta
`dist/server.js` directamente con Node. Si aún no has hecho

`npm run build`, `dist/` no existe y Node falla con su error nativo
`Cannot find module '.../dist/server.js'`. Ese error no es un bug: es la
señal de que falta el build. La regla del ciclo es **primero `build`,
luego `start`**, y así interiorizas que `dev` (ejecuta `.ts` con `tsx`) y
`start` (ejecuta lo compilado) son dos caminos distintos.

## PARA DESARROLLO
`npm run dev` **sí compila** y ejecuta el `.ts` directamente con `tsx`. Es
una herramienta de desarrollo que no se usa en producción. En producción
siempre se ejecuta el `.js` compilado con `node dist/server.js`.

### Sobre la extensión `.js` en los imports

Con `"type": "module"` y `moduleResolution: NodeNext`, los imports
**relativos** llevan la extensión `.js` aunque el fichero real sea
`.ts`:

```ts
import { createApp } from './app.js';   // así, aunque el fichero sea app.ts
```

Si lo escribes como `'./app'` o `'./app.ts'`, el build fallará con
`ERR_MODULE_NOT_FOUND` o con un error de resolución de módulos. Es una de las
preguntas clásicas de este topic.

## EJERCICIOS: 

- Intenta ejecutar `npm start` sin hacer `npm run build` antes y asegurandote de que no tienes carpeta `dist`. ¿Qué error da? ¿Por qué?
- Intenta ejecutar `npm run typecheck` y `npm run build` con un error de tipo, por ejemplo cambiando el tipo de `PORT` a `string` en `server.ts` (Recuerda guardar el archivo para que tenga efecto el error). ¿Qué error da? ¿Por qué?