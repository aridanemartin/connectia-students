# Prepara VS Code: vista previa de Markdown y Mermaid

> Guía para la Actividad 0. Es un ejercicio **individual**: no hay fichero
> que copiar al repositorio del equipo ni entregable de grupo. Al terminar,
> cada miembro debe poder leer el material del curso y ver los diagramas
> sin salir de VS Code. Tiempo estimado: 15–20 minutos.

## Por qué esta actividad es la 00

Todo el material de la asignatura es **Markdown y Mermaid**:
ficheros `.md` (el README de cada semana, las plantillas de ejercicios) y
diagramas Mermaid (bloques ```` ```mermaid ```` dentro del Markdown y
ficheros `.mmd` en la carpeta `diagrams/`). GitHub los renderiza sin
configurar nada, pero cuando los tratas de leer en **local** el editor necesita dos cosas: saber usar
la vista previa de Markdown (que VS Code ya trae de serie) y añadir las
extensiones que renderizan Mermaid. Sin esto, la lectura de estos ficheros es mucho más incómoda.

## Qué trae VS Code de serie y qué le falta

La **vista previa de Markdown** ya está incluida en VS Code:

| Acción | macOS | Windows / Linux |
|--------|-------|-----------------|
| Abrir o cerrar la vista previa | `Cmd+Shift+V` | `Ctrl+Shift+V` |
| Vista previa al lado del editor | `Cmd+K V` | `Ctrl+K V` |

Con esto ya puedes leer cualquier `.md` del repositorio. Lo que la vista
previa estándar **no** hace:

- Renderizar bloques ```` ```mermaid ````: los muestra como código.
- Parecerse a GitHub: usa un estilo propio, no el de GitHub.
- Previsualizar ficheros mermaid `.mmd` sueltos (los diagramas de `diagrams/`).

Eso es exactamente lo que cubren las extensiones recomendadas.

## Las extensiones recomendadas

Este repositorio incluye un fichero `.vscode/extensions.json` con una lista
de extensiones recomendadas. Este fichero lo que hace es que cuando abres la carpeta del repositorio en VSCode **por primera vez**, aparece una notificación ofreciéndote instalarlas de una vez.

 Estas son las extensiones que se recomiendan para trabajar con Markdown y Mermaid en VS Code. La lista vive en Git, lo que significa que todos los miembros del equipo comparten las mismas es una buena práctica: evita que cada miembro del equipo tenga que buscar y decidir qué extensiones instalar, y asegura que todos ven los diagramas de la misma manera desde el primer momento. 
 
 Por eso se recomienda abrir la carpeta del repositorio en VS Code **inmediatamente después de hacer `git clone`**, para que las extensiones se instalen antes de empezar a trabajar.  

| Extensión | Identificador | Qué aporta |
|-----------|---------------|------------|
| Markdown Preview GitHub Styling | `bierner.markdown-preview-github-styles` | La vista previa de Markdown adopta el estilo de GitHub: lo que ves en local es lo que verá quien revise tu PR |
| Markdown Preview Mermaid Support | `bierner.markdown-mermaid` | Renderiza los bloques ```` ```mermaid ```` dentro de la vista previa de Markdown |
| Mermaid Markdown Syntax Highlighting | `bpruitt-goddard.mermaid-markdown-syntax-highlighting` | Colorea la sintaxis Mermaid mientras editas, dentro de los `.md` y de los `.mmd` |
| Mermaid Preview | `vstirbu.vscode-mermaid-preview` | Previsualiza ficheros `.mmd` sueltos (los de `diagrams/`) en una pestaña al lado del editor |

## Cómo instalarlas

### Vía 1 — Acepta la recomendación del workspace (la cómoda)

1. Abre la **carpeta del repositorio** en VS Code (`File → Open Folder...`),
   no un fichero suelto: las recomendaciones son por carpeta abierta.
2. Si aparece la notificación de recomendaciones, pulsa **Install**:
   instala la lista completa de una vez.
3. Si la notificación no aparece, tienes tres caminos equivalentes:
   - Vista de extensiones (`Cmd/Ctrl+Shift+X`), escribe `@recommended` en
     el buscador e instala las de **Workspace Recommendations**.
   - Paleta de comandos (`Cmd/Ctrl+Shift+P`) → **Extensions: Show
     Recommended Extensions**.
   - Pestaña del aviso en la esquina inferior derecha del explorador de
     archivos ("Install Workspace Recommended Extensions").

### Vía 2 — Instalación manual desde el Marketplace

1. Abre la vista de extensiones (`Cmd/Ctrl+Shift+X`).
2. Busca cada extensión por su nombre, o pega su identificador exacto
   precedido de `@id:` (por ejemplo, `@id:bierner.markdown-mermaid`) para
   encontrar la exacta y no una imitación con nombre parecido.
3. Pulsa **Install** en cada una. La primera vez que instalas una extensión
   de un editor tercero, VS Code te pedirá confirmar que confías en el
   editor (publisher): léelo antes de aceptar.

## Cómo usarlas: la prueba de fuego

1. Abre el `README.md` de esta semana
   (`topics/topic-01-UT1-project-kickoff/README.md`).
2. Pulsa `Cmd/Ctrl+K V` para la vista previa al lado del editor y
   comprueba que el documento usa el estilo de GitHub (tablas, citas y cabeceras como
     en el navegador).
3. Abre `diagrams/system-context-diagram.mmd` (el diagrama de referencia de
   la semana) y previsualízalo con el botón de *preview* de la esquina
   superior derecha del editor, o con la paleta de comandos (`Cmd/Ctrl+Shift+P`) →
   **Mermaid Preview: Preview Diagram**. Deben aparecer los seis nodos:
   backend en azul y servicio de IA en rojo discontinuo.

## Apuntes: qué hace VS Code con `.vscode/extensions.json`

- La lista de `.vscode/extensions.json` es una **sugerencia**, nunca una
  instalación automática: VS Code pregunta una vez al abrir el workspace y
  respetará tu decisión.
- Si ignoras una recomendación (página de la extensión → engranaje →
  *Ignore Recommendation*), VS Code deja de sugerírtela.
- Añadir una extensión a la lista es una edición de texto más: se propone
  como cualquier otro cambio, pasa por PR y llega al resto del equipo con
  el siguiente `git pull`. Es la misma filosofía del curso: configuración
  versionada, revisada y compartida en Git.