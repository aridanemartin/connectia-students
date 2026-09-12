# Diagnosticar un servidor que no arranca — Actividad 7


## Para qué sirve esta actividad

Un servidor que no arranca es, con diferencia, el problema más frecuente
que vais a diagnosticar en todo el curso. Casi siempre entra en una de tres
categorías: **falta configuración** (`.env`), **falta una dependencia**
(`node_modules/`) o **el puerto ya está ocupado**. Esta actividad os hace
provocar los tres fallos a propósito, sobre un proyecto que sabéis que
funciona, para que reconozcáis el síntoma la próxima vez que ocurra por
accidente.

Reproduce los tres escenarios **por separado**, uno detrás de otro, dejando
el proyecto en estado funcional entre cada uno.

## Escenario A — falta `.env`

```bash
cd topics/topic-02-UT1-running-project-bruno-basics/code/backend
mv .env .env.bak
npm run dev
```

**Qué observar**: el proceso termina con un mensaje que nombra la variable
que falta y cómo solucionarlo. Cuando termines, restaura el fichero:

```bash
mv .env.bak .env
```

### Evidencia

```text
<pega aquí la salida completa del terminal>
```

**¿Por qué falla?**

```text
<tu respuesta: explica en una frase por qué `.env` es necesario y qué
símbolo/variable falta en process.env cuando no existe>
```

## Escenario B — falta una dependencia (`node_modules/` ausente)

```bash
cd topics/topic-02-UT1-running-project-bruno-basics/code/backend
mv node_modules node_modules.bak
npm run dev
```

**Qué observar**: el intérprete no encuentra el comando `tsx` (o el módulo
`express`), porque `node_modules/` no existe. Este es el mismo síntoma que
verás si clonas un proyecto nuevo y olvidas ejecutar `npm install`. Cuando
termines, restaura la carpeta:

```bash
rm -rf node_modules
mv node_modules.bak node_modules
```

### Evidencia

```text
<pega aquí la salida completa del terminal>
```

**¿Cómo se soluciona?**

```text
<tu respuesta>
```

## Escenario C — puerto ya en uso

Necesitas **dos** terminales para este escenario.

**Terminal 1** — arranca el servidor normalmente y déjalo corriendo:

```bash
cd topics/topic-02-UT1-running-project-bruno-basics/code/backend
npm run dev
```

**Terminal 2** — con el anterior aún corriendo, intenta arrancar una
segunda copia:

```bash
cd topics/topic-02-UT1-running-project-bruno-basics/code/backend
npm run dev
```

**Qué observar**: la segunda copia no puede escuchar en el puerto `3000`
porque la primera ya lo tiene ocupado, y termina con un mensaje que nombra
el puerto en conflicto. Cierra ambas terminales con `Ctrl+C` al terminar.

> Nota de la salida real observada en macOS: puede aparecer brevemente la
> línea "Connectia Week 02 demo backend listening..." seguida
> **inmediatamente** del mensaje de puerto ocupado, y el proceso termina con
> código de salida distinto de cero. Documenta la salida real de tu propio
> sistema operativo — puede variar ligeramente entre macOS, Linux y
> Windows, pero el resultado final (error claro + salida no-cero) es el
> mismo en los tres.

### Evidencia

```text
<pega aquí la salida completa de la Terminal 2>
```

**¿Cómo se soluciona?**

```text
<tu respuesta: nombra al menos una forma de liberar el puerto o de cambiar
PORT en .env>
```