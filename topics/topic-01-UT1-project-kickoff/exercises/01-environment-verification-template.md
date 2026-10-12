# Verificación de entorno del equipo

> Plantilla para la Actividad 1. Copia este fichero a tu repositorio de equipo
> como `team-docs/environment-verification.md`. Añade un bloque
> por cada miembro del equipo con la salida literal del comando de
> verificación.


## Para qué sirve esta actividad

Antes de escribir una sola línea de código hay que confirmar que **cada**
miembro del equipo tiene instaladas las herramientas mínimas. No basta con
"creo que tengo Node": lo demostramos con la salida literal de un comando.
Si un miembro tiene una versión antigua, cualquier ejercicio posterior
fracasará de forma confusa (errores que en otro equipo funcionan), así que
aprovecharemos y aprenderemos a comprobar que versiones tenemos instaladas.

## Apuntes: qué comprueba el comando

El comando de verificación nos dice la versión de Node.js y de Git que hay instaladas en la máquina. 

👀 ¡Ojo! - Recuerda haber reiniciado el ordenador después de instalar cualquier herramienta y **haber cerrado y abierto de nuevo la terminal** antes de ejecutar el comando. Ambas son:

En **Mac / Linux**:

```bash
node --version && git --version
```

- **`node --version`** — imprime la versión de Node.js instalada. La salida
  empieza con `v` (de *version*): `v22.12.0` significa Node.js 22.12.0.
- **`&&`** — el operador "y entonces". Ejecuta el segundo comando **solo
  si el primero termina con éxito** (código 0). Si `node` no estuviera
  instalado o fallara, `git --version` ni siquiera se intenta.
- **`git --version`** — imprime la versión de Git instalada. La salida es
  de la forma `git version 2.42.0`.

En **Windows PowerShell**:

```powershell
node --version; git --version
```

El `;` separa dos comandos que se ejecutan uno tras otro (PowerShell no
usa `&&` con la misma semántica). La plantilla admite ambas variantes.

## Apuntes: versiones mínimas

| Herramienta | Mínimo | Recomendado | Por qué |
|-------------|--------|-------------|---------|
| Node.js | v20.19.0 | v22 LTS | El backend de la Semana 03 exige Node 20.19+ (`process.loadEnvFile()`, ESLint) |
| Git | 2.0.0 | 2.42+ | El flujo de PR y ramas de la Semana 01 funciona con Git ≥ 2 |

Lectura de la salida: si tu Node imprime `v16.x`, es **insuficiente**. Si
imprime `v20.19.0` o `v22.12.0`, **cumples**. Si Git imprime `git version
2.39.0`, **cumples** (≥ 2.0).

## Cómo capturar la evidencia

1. Abre una terminal (Terminal.app en macOS, PowerShell en Windows, o la
   terminal de tu distribución Linux).
2. Ejecuta el comando correspondiente a tu sistema operativo.
3. **Copia literalmente** las dos líneas de salida (no las reescribas a
   mano: debe ser la salida real de tu máquina).
4. Pega esas líneas dentro del bloque `` ```text `` que corresponde a tu
   nombre más abajo.
5. Si tu versión está **por debajo del mínimo**, no pegues la salida como
   si valiera: actualiza primero (ver "¿Versión insuficiente?" al final) y
   vuelve a ejecutar el comando hasta que la salida cumpla.

