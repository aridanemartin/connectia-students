# ESLint, el linter — Actividad 5

## Qué se añade en esta actividad

El proyecto ya compila en estricto y carga su configuración desde un único
módulo. Le falta **higiene de código**, y eso son dos herramientas
distintas que la gente confunde constantemente:

- un **linter** (ESLint), que busca **errores probables** → esta actividad;
- un **formateador** (Prettier), que unifica el **estilo** → Actividad 6.

Aquí instalamos y configuramos **solo el linter**: `eslint.config.js` y el
script `lint`.

> **Ojo con la confusión habitual**: un linter **no** te dice si el código
> está bonito, y un formateador **no** te dice si tiene bugs. Son dos
> trabajos separados y por eso llevan dos configuraciones y dos scripts.

> **En tu repositorio del backend**: instala ESLint, crea `eslint.config.js`,
> añade el script `lint` y consigue que `npm run lint` salga limpio.

## Estructura de ficheros que debes crear en esta actividad

Crea **un fichero nuevo** (`eslint.config.js`) y **modifica `package.json`**
(script `lint`):

```
./   (raíz del repositorio del backend)
├── package.json        # A1-A4: MODIFICADO en A5 — se añade el script lint
├── tsconfig.json       # A3: sin cambios
├── eslint.config.js    # A5: NUEVO — configuración de ESLint
├── .gitignore          # A2: sin cambios
├── .env.example        # A2: sin cambios
└── src/
    ├── server.ts       # A4: sin cambios en esta actividad
    └── config/
        └── env.ts      # A4: sin cambios
```

`.prettierrc.json` y `.prettierignore` llegan en la Actividad 6; `app.ts` y
`routes/health.ts` en la Actividad 7.

## Paso 1 — instalar ESLint

ESLint solo se usa **mientras programas**: nunca en producción. Por tanto,
las cuatro piezas van a `devDependencies` (recuerda el `-D` de la
Actividad 1):

```bash
npm install -D eslint @eslint/js typescript-eslint globals
```

Qué es cada una:

| Paquete | Para qué sirve |
|---|---|
| `eslint` | El linter en sí: el programa que recorre tus ficheros. |
| `@eslint/js` | El conjunto de reglas recomendadas para JavaScript. |
| `typescript-eslint` | El **parser** que permite a ESLint entender TypeScript, más sus reglas específicas de TS. Sin esto, ESLint no sabe leer un `.ts`. |
| `globals` | La lista de nombres globales de cada entorno (los de Node: `process`, `console`, `Buffer`...). |

## Paso 2 — `eslint.config.js`

Usamos la **flat config** de ESLint (9 y posteriores): un módulo ESM que
exporta un **array** de objetos de configuración, que ESLint aplica en
orden (cada uno puede pisar lo que diga el anterior).

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,               // reglas recomendadas para JS
  ...tseslint.configs.recommended,      // reglas recomendadas para TS
  {
    files: ['src/**/*.ts'],             // + globals de Node para tu código
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  },
];
```

Desglose:

- **`ignores`**: ESLint ni siquiera mira `dist/` (código generado por el
  compilador: no es tuyo, no lo lintes) ni `node_modules/`.
- **`js.configs.recommended`**: el conjunto recomendado para JavaScript
  plano — cosas como `no-dupe-else-if` (la misma condición repetida en dos
  `else if`) o `no-self-assign` (`x = x`).
- **`...tseslint.configs.recommended`**: el conjunto recomendado de
  `typescript-eslint`. Fíjate en el **spread (`...`)**: ese valor es un
  *array* de configuraciones, no una sola, y hay que desplegarlo dentro del
  array exterior.
- **`files: ['src/**/*.ts']`** + **`globals: globals.node`**: declara qué
  nombres globales existen en tu código. Sin esta línea, ESLint marcaría
  `process` y `console` como `no-undef` ("no definido"), porque no sabe que
  tu código corre en Node.

> **Fíjate en que el fichero es `.js`, no `.ts`**, y usa `import`/`export`
> (ESM) porque tu `package.json` declara `"type": "module"` desde la
> Actividad 1. ESLint lee su configuración antes de que exista ningún
> compilador de TypeScript, así que tiene que ser JavaScript ejecutable
> directamente.

## Paso 3 — el script `lint`

Añade el script al `package.json`:

```json
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint ."
  }
```

El `.` es "analiza desde el directorio actual hacia abajo"; qué quedará
fuera ya lo decide el `ignores` del `eslint.config.js`.

## Apuntes: qué detecta un linter (y qué no)

ESLint analiza el código buscando **errores probables**: no fallos de
sintaxis (de eso ya se encarga el compilador), sino patrones que
habitualmente acaban en bugs. Con la configuración de arriba quedan activas
unas **70 reglas**. Cuatro de las que más vas a ver:

| Regla | Qué detecta |
|---|---|
| `@typescript-eslint/no-unused-vars` | Una variable declarada y nunca usada: casi siempre, código muerto o un error de nombre. |
| `prefer-const` | Un `let` que nunca se reasigna. Declarar la intención correcta (`const`) evita que alguien lo reasigne por error más adelante. |
| `use-isnan` | Comparar algo con `NaN` usando `===`. **Nunca** funciona: `NaN === NaN` es `false`. Hay que usar `Number.isNaN(x)`. |
| `@typescript-eslint/no-explicit-any` | Un `any` escrito a mano: apaga la comprobación de tipos justo donde más falta hace (conecta con el `strict: true` de la Actividad 3). |

Tres ideas que debes poder explicar:

1. **Las reglas tienen nombre.** Cada violación se reporta con el nombre de
   la regla que la detectó. Ese nombre es tu punto de partida: se busca en
   la documentación y te explica el porqué.
2. **Un linter no opina de estética.** Que uses comillas simples o dobles,
   o dónde se parte una línea larga, no es trabajo suyo: es del formateador
   de la Actividad 6.
3. **El linter y el compilador se reparten el trabajo.**
   `tseslint.configs.recommended` **desactiva a propósito** varias reglas
   clásicas de ESLint —`no-unreachable` (código después de un `return`),
   `no-undef`, `eqeqeq`— porque TypeScript ya detecta esos casos por su
   cuenta, y tenerlos duplicados solo daría el mismo error dos veces. Si
   escribes código después de un `return`, ESLint **no** dirá nada: te lo
   dirá `tsc`. No es un fallo de la configuración, es el reparto de tareas.

## Comprobación — `npm run lint` sale limpio

1. Asegúrate de no tener cambios a medias en `src/`.
2. Ejecuta `npm run lint`.
3. **Esperado**: ninguna salida y código de salida 0. En Unix puedes
   comprobar el código con `echo $?` justo después.

Un linter que no dice nada es un linter contento: no imprime "todo bien",
simplemente calla.

## Ejercicios

**1. Demuestra que ESLint detecta errores probables.**

1. Añade al final de `src/server.ts` una variable declarada y **nunca
   usada**:

   ```ts
   const unused = 42;
   ```

   Es una variable local: no se exporta ni se usa en ningún sitio.
2. Ejecuta `npm run lint`.
3. **Esperado**: código de salida ≠ 0 y la **regla nombrada** en el mensaje,
   típicamente `@typescript-eslint/no-unused-vars`.
4. Anota en una línea qué cambio hiciste y qué regla saltó (por ejemplo:
   "añadí `const unused = 42;` en `src/server.ts` → `@typescript-eslint/no-unused-vars`").
5. Revierte el cambio: el código entregado no puede contener la violación.

**2. El compilador no es el linter.** Con `const unused = 42;` todavía en el
código, ejecuta `npm run typecheck`.
**Esperado**: pasa sin errores. Una variable sin usar es TypeScript
perfectamente válido — por eso hace falta un linter *además* del compilador.
Son dos redes distintas, y cada una atrapa cosas que la otra deja pasar.

**3. Provoca otras reglas.** Añade cada uno de estos bloques al final de
`src/server.ts` (uno cada vez, y revierte antes del siguiente), ejecuta
`npm run lint` y apunta el nombre de la regla que salta:

```ts
let saludo = 'hola';
console.log(saludo);
```

```ts
if (env.PORT === NaN) {
  console.log('puerto inválido');
}
```

```ts
function parsea(dato: any) {
  return dato;
}
console.log(parsea('hola'));
```

El tercero conecta con la Actividad 3: `strict: true` prohíbe los `any`
**implícitos**, pero un `any` que tú escribes a mano es legal para el
compilador. Es el linter quien te pregunta si de verdad querías hacer eso.

**4. Lee lo que te dice.** Elige una de las reglas que has hecho saltar y
busca su nombre en [eslint.org/docs/latest/rules](https://eslint.org/docs/latest/rules)
(o en [typescript-eslint.io/rules](https://typescript-eslint.io/rules) si
empieza por `@typescript-eslint/`). Resume en una frase **por qué** esa
regla existe. Ese es el hábito útil: la regla no es un capricho, documenta
un bug que alguien ya sufrió.
