# Prettier, el formateador — Actividad 6

## Qué se añade en esta actividad

La Actividad 5 dejó el **linter** funcionando: ESLint te avisa de errores
probables. Pero hay una categoría de discusiones que ESLint no resuelve —y
no debe resolver— porque no son bugs:

> ¿Comillas simples o dobles? ¿Punto y coma al final? ¿Dónde se parte una
> línea de 140 caracteres? ¿Coma después del último elemento de un array?

Ninguna de las dos opciones está "mal". Pero si cada persona del equipo
elige la suya, pasan dos cosas malas:

1. **Los diffs de Git se llenan de ruido.** Abres un pull request de 3
   líneas de lógica y Git te muestra 80 líneas cambiadas, porque tu editor
   reformateó el fichero a su manera. Revisar eso es imposible.
2. **Se pierde tiempo discutiéndolo** en cada revisión de código.

Un **formateador** elimina el problema de raíz: el estilo deja de ser una
decisión personal y pasa a ser una **configuración del proyecto**. Esta
actividad añade Prettier: `.prettierrc.json`, `.prettierignore` y los
scripts `format` y `format:check`.

> **En tu repositorio del backend**: instala Prettier, crea sus dos ficheros
> de configuración, añade los scripts `format` y `format:check`, y consigue
> que `npm run format:check` salga limpio.

## Estructura de ficheros que debes crear en esta actividad

Crea **dos ficheros nuevos** y **modifica `package.json`** (scripts `format`
y `format:check`):

```
./   (raíz del repositorio del backend)
├── package.json        # A1-A5: MODIFICADO en A6 — se añaden format y format:check
├── tsconfig.json       # A3: sin cambios
├── eslint.config.js    # A5: sin cambios
├── .prettierrc.json    # A6: NUEVO — configuración de Prettier
├── .prettierignore     # A6: NUEVO — rutas que Prettier debe ignorar
├── .gitignore          # A2: sin cambios
├── .env.example        # A2: sin cambios
└── src/
    ├── server.ts       # A4: sin cambios en esta actividad
    └── config/
        └── env.ts      # A4: sin cambios
```

`app.ts` y `routes/health.ts` llegan en la Actividad 7.

## Paso 1 — instalar Prettier

Como ESLint, solo se usa mientras programas → `devDependencies`:

```bash
npm install -D prettier@3
```

Un solo paquete: Prettier no necesita plugins para TypeScript, JSON o
Markdown — los entiende de fábrica.

## Paso 2 — `.prettierrc.json`

Prettier es deliberadamente **poco configurable**: tiene pocas opciones a
propósito, para que el equipo no pueda discutir de casi nada. Las tres que
fijamos:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

| Opción | Qué hace | Por qué la elegimos |
|---|---|---|
| `singleQuote: true` | Comillas simples: `'texto'` en vez de `"texto"` | Convención dominante en el ecosistema Node/TS. Cualquiera de las dos valdría; lo que importa es que sea **una**. |
| `trailingComma: "all"` | Coma final también en el último elemento de objetos, arrays y parámetros | **Reduce el ruido en los diffs**: añadir un elemento al final toca 1 línea en vez de 2 (la nueva y la anterior, que necesitaría la coma). |
| `printWidth: 100` | Las líneas se parten alrededor de los 100 caracteres | Legible en pantalla partida y en los diffs de GitHub sin scroll horizontal. |

> Todo lo que **no** aparece aquí usa el valor por defecto de Prettier (2
> espacios de indentación, punto y coma al final, etc.). No hace falta
> declararlo: menos configuración, menos que mantener.

## Paso 3 — `.prettierignore`

Igual que Git tiene su `.gitignore` y ESLint su `ignores`, Prettier tiene su
propia lista de exclusiones:

```gitignore
node_modules/
dist/
package-lock.json
```

Por qué cada una:

- **`node_modules/`**: código ajeno. No es tuyo y no se formatea.
- **`dist/`**: lo genera `tsc`. Reformatearlo sería absurdo: se regenera en
  el siguiente build.
- **`package-lock.json`**: lo genera npm, no tú. Son miles de líneas que
  nadie edita a mano.

> Sobre `package-lock.json`: hoy npm lo escribe con el mismo estilo de JSON
> que usaría Prettier, así que si lo quitas del `.prettierignore` no pasa
> nada visible. Lo excluimos de todas formas por el **principio**: los
> ficheros generados los formatea quien los genera. Depender de que dos
> herramientas coincidan para siempre es una apuesta que no hace falta
> hacer. Lo compruebas en el ejercicio 5.

## Paso 4 — los dos scripts

```json
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
```

Son dos modos de la misma herramienta, y la diferencia es importante:

| | `npm run format` | `npm run format:check` |
|---|---|---|
| Flag | `--write` | `--check` |
| Qué hace | **Reescribe** tus ficheros ya formateados | **No toca nada**: solo mira |
| Código de salida | 0 (ha arreglado lo que hubiera) | 0 si todo está formateado; ≠ 0 listando los ficheros que no lo están |
| Dónde se usa | En tu máquina, mientras programas | En revisión y en CI (Topic 08): una máquina no debe reescribir tu código, solo rechazarlo |

**En este topic el código entregado debe superar `format:check`.** Lo más
cómodo es instalar la extensión de Prettier en VS Code y activar *Format on
Save*: así nunca tendrás que acordarte de ejecutar nada.

## Linter vs. formateador — la tabla que debes saber explicar

Es el concepto que este topic evalúa. Dos herramientas, dos trabajos:

| | ESLint (linter, A5) | Prettier (formateador, A6) |
|---|---|---|
| ¿Qué busca? | **Errores probables**: código muerto, `==`, variables sin usar | **Estilo inconsistente**: comillas, comas, ancho de línea, indentación |
| ¿Puede romper tu programa si lo ignoras? | Sí: señala bugs reales | No: el código funciona igual, solo se lee peor |
| ¿Reescribe el código? | Solo si se lo pides (`--fix`), y con cuidado | Es su único modo de trabajo |
| ¿Hay respuesta "correcta"? | Sí: la regla documenta un bug | No: solo acuerdo de equipo |
| Si lo quitas del proyecto... | Aparecen bugs que nadie vio | Los diffs se vuelven ilegibles |

La frase para recordarlo: **ESLint te dice que tu código está mal; Prettier
te dice que tu código está desordenado.** Por eso hacen falta los dos, y por
eso son dos configuraciones separadas.

## Comprobación — `npm run format:check` sale limpio

1. Ejecuta `npm run format` una vez (deja todo el proyecto formateado).
2. Ejecuta `npm run format:check`.
3. **Esperado**: mensaje de que todos los ficheros usan el estilo de
   Prettier y código de salida 0.
4. Ejecuta `git diff` para ver **qué** ha reformateado el paso 1. Si no
   cambió nada, tu código ya cumplía el estilo.

## Ejercicios

**1. Demuestra que Prettier detecta código mal formateado.**

1. Añade al final de `src/server.ts` una línea **mal formateada**:

   ```ts
   const x = 1; const y = 2;
   ```

   Es TypeScript perfectamente válido, pero mete dos declaraciones en una
   línea.
2. Ejecuta `npm run format:check`.
3. **Esperado**: código de salida ≠ 0 y el **nombre del fichero** en la
   lista de ficheros a reformatear.
4. Ahora ejecuta `npm run format` y mira el fichero: Prettier ha partido la
   línea en dos. Esa es la diferencia entre `--check` y `--write`.
5. Revierte el cambio antes de continuar.

**2. El formateador no es el linter.** Con `const x = 1; const y = 2;`
todavía en el código, ejecuta `npm run typecheck` y `npm run lint`.
**Esperado**: `typecheck` pasa (es código válido) y `lint` falla, pero
**por otro motivo**: las variables no se usan
(`@typescript-eslint/no-unused-vars`), no por el formato. Compruébalo y
explica en una línea por qué ESLint no menciona la línea doble.

**3. Formatea a propósito algo feo.** Pega esto en `src/server.ts`, ejecuta
`npm run format` y compara el antes y el después con `git diff`:

```ts
const config = {nombre:"connectia",puerto:3000,tags:['api','backend','docs','questions','express','typescript']}
```

¿Cuántas de las tres opciones de tu `.prettierrc.json` puedes identificar en
el resultado? Revierte al terminar.

**4. Cambia una opción y observa.** Pon `"singleQuote": false` en
`.prettierrc.json`, ejecuta `npm run format` y mira `git diff`: todas las
comillas de tu proyecto han cambiado de golpe. Es exactamente el diff
gigante y sin valor que describíamos al principio. **Déjalo otra vez en
`true`** y vuelve a ejecutar `npm run format`.

**5. ¿Por qué `package-lock.json` está en `.prettierignore`?** Quítalo de la
lista y ejecuta `npm run format`, después `git status`.
**Esperado**: el fichero **no cambia** — Prettier dirá `(unchanged)`, porque
npm ya escribe su JSON con el mismo estilo (2 espacios de indentación).
Vuelve a ponerlo en la lista y responde: si el resultado es el mismo, ¿por
qué molestarse en excluirlo? Pista: ¿quién decide el formato de un fichero
que tú no escribes, y qué pasaría el día que npm o Prettier cambien de
criterio?
