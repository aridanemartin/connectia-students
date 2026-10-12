# Semana 01 — Arranque del proyecto

Bienvenida y bienvenido al proyecto de la asignatura de **Desarrollo Web en
Entorno Servidor** (DSW). Esta primera semana no escribimos aún ningún
backend; sentamos las bases para trabajar en equipo durante todo el curso:
entendemos qué vamos a construir, con quién, sobre qué herramientas y con
qué flujo de trabajo.

> **Idioma**: las explicaciones pedagógicas están en español. Los
> identificadores técnicos (`node`, `git`, `main`, nombres de rutas y de
> ficheros) van en inglés.

## Objetivos de aprendizaje

Al finalizar esta semana serás capaz de:

- Explicar en lenguaje claro el sistema completo que vamos a construir.
- Distinguir qué partes son responsabilidad del alumnado (backend Express) y
  qué partes son responsabilidad del profesorado (servicio de IA como caja
  negra).
- Enumerar los dos tipos de usuario público y administrador del sistema.
- Verificar que tu entorno de desarrollo funciona (Node.js ≥ 20.19 y Git ≥ 2).
- Completar el ciclo Git básico: clonar → crear rama → confirmar cambios →
  publicar → abrir *pull request* → recibir revisión → integrar.
- Producir en equipo un diagrama de contexto del sistema y un backlog
  inicial de trabajo.

## Prerrequisitos

- Ninguno técnico: esta es la primera semana del curso.
- Acceso a un ordenador (portátil personal o equipo de aula) donde puedas
  instalar Node.js ≥ 20.19 y Git ≥ 2. Si no puedes instalar en tu equipo, el
  profesorado tiene equipos de aula de reserva.
- Visual Studio Code instalado (gratuito,
  [code.visualstudio.com](https://code.visualstudio.com)). Lo necesitas
  desde la Actividad 0.
- Cuenta de GitHub personal (gratuita) creada antes del inicio de la
  primera sesión.

## Conceptos de la semana

- **Sistema Connectia** — La aplicación permite a cualquier visitante público
  hacer preguntas sobre información institucional del centro. Un
  administrador (personal del centro) sube y activa los documentos oficiales
  (PDF) sobre los que se pueden hacer preguntas.
- **Backend Express** — La aplicación web que **el alumnado** construye
  durante el curso. Gestiona autenticación de administradores, subida y
  activación de documentos, la API pública de preguntas, y coordina las
  peticiones al servicio de IA.
- **Servicio de IA** — Un servicio HTTP interno **desarrollado por el
  profesorado**. Es una **caja negra**: recibe peticiones del backend y
  responde con resultados. El alumnado nunca implementa lo que hay dentro
  (extracción de texto de PDF, embeddings, búsqueda vectorial, inferencia
  del modelo, etc.).
- **Documento y versión de documento** — Un "documento lógico" (por
  ejemplo, "Normas de convivencia") puede tener varias versiones a lo largo
  del curso. Solo una versión de cada documento está activa a la vez.
- **Regla — sin conjuntos de documentos** — No existen "colecciones" ni
  "sets" de documentos. Todos los documentos activos forman un único
  conjunto sobre el que se buscan respuestas.
- **Regla — las preguntas públicas buscan en todos los documentos activos** —
  Una pregunta pública **nunca** menciona un documento concreto. El servicio
  de IA busca a través de **todas** las versiones activas.

## Ejemplo guiado

El profesor recorre el diagrama de contexto disponible en
[`diagrams/system-context-diagram.mmd`](./diagrams/system-context-diagram.mmd)
y explica cada componente y cada flecha en clase:

```mermaid
flowchart LR
    visitor[Visitante público] --> backend
    admin[Administrador] --> backend
    backend[Backend Express<br/>ALCANCE DEL ALUMNADO] <-->|contrato HTTP| ai[Servicio de IA<br/>CAJA NEGRA - PROFESORADO]
    backend <--> db[(PostgreSQL)]
    backend <--> pdf[Almacenamiento PDF]
```

Durante la demostración se marcan explícitamente las tareas que **sí**
implementaréis (subida de PDF, autenticación de administrador, endpoint
público de preguntas, gestión de versiones) y las que **no** implementaréis
(OCR, extracción de texto, embeddings, ranking, inferencia). El límite entre
"alcance del alumnado" y "caja negra" es lo más importante de esta primera
semana.

## Actividades del alumnado

### Actividad 0 — Prepara tu editor: Markdown y Mermaid en VS Code

**Objetivo**: cada miembro deja VS Code preparado para leer el material del
curso en local: vista previa de Markdown con estilo GitHub y renderizado de
diagramas Mermaid (en `.md` y en ficheros `.mmd`).

**Cómo**: sigue la guía
[`exercises/00-vscode-markdown-mermaid-setup.md`](./exercises/00-vscode-markdown-mermaid-setup.md).
El repositorio incluye `.vscode/extensions.json` con las extensiones
recomendadas: al abrir la carpeta por primera vez, VS Code te ofrecerá
instalarlas de una vez.

**Entregable**: ninguno. Es preparación individual para la Actividad 1 y
la Actividad 4. Opcionalmente, pega la salida de `code --list-extensions`
en tu verificación de entorno como evidencia del editor preparado.

**Criterio de aceptación**: la vista previa del `README.md` de la semana
renderiza el diagrama del "Ejemplo guiado" y el fichero
`diagrams/system-context-diagram.mmd` se previsualiza en VS Code.

### Actividad 1 — Verificación individual del entorno

**Objetivo**: cada miembro del equipo confirma que su equipo puede ejecutar
Node.js y Git en las versiones mínimas requeridas.

**Entregable**: fichero `team-docs/environment-verification.md` en el
repositorio del equipo, siguiendo la plantilla
[`exercises/01-environment-verification-template.md`](./exercises/01-environment-verification-template.md).

**Criterio de aceptación**: cada miembro aparece con un bloque de salida
literal de `node --version && git --version`; Node ≥ v20.19, Git ≥ 2.

Consulta [`code/verify-environment.md`](./code/verify-environment.md) para
el comando exacto y variantes por sistema operativo.

### Actividad 2 — Formación de equipo y roster

**Objetivo**: formar un equipo de 3 o 4 personas, asignar los cuatro roles
del bloque actual y registrar el equipo.

**Roles** (rotan cada ~4 semanas, un cambio por bloque pedagógico, ~5
rotaciones en el curso):

- **Coordinador/a** — organiza reuniones, mantiene el ritmo, hace de enlace
  con el profesorado.
- **Integrador/a** — protege la rama `main` del equipo, resuelve conflictos
  de fusión, revisa las *pull requests* con más atención.
- **Responsable de calidad** — vela por los tests y por el cumplimiento del
  contrato de la semana; escribe el checklist de aceptación del incremento.
- **Documentador/a** — mantiene el README de equipo actualizado, redacta las
  entradas del backlog y del diario del equipo.

**Entregable**: `team-docs/team-roster.md` en el repositorio del equipo,
siguiendo la plantilla
[`exercises/02-team-roster-template.md`](./exercises/02-team-roster-template.md).
Deja preparadas 5 subsecciones de rotación (Bloque 1 completo; Bloques 2 a
5 en blanco para rellenar más adelante).

**Criterio de aceptación**: entre 3 y 4 miembros, cada uno con nombre
completo, cuenta de GitHub y correo institucional; los cuatro roles
asignados en el Bloque 1.

### Actividad 3 — Flujo Git básico

**Objetivo**: cada miembro del equipo realiza el ciclo completo del flujo Git
sobre el repositorio de su equipo en GitHub.

**Modelo del repositorio**:

- **Cada equipo tiene su propio repositorio** en GitHub (creado como parte
  de la organización del curso; el profesorado indica cómo crearlo o lo crea
  en la primera sesión).
- El profesorado es dueño de la rama `main` (protegida).
- El backend vive en la **raíz** del repositorio (un proyecto Node.js
  normal) y los documentos del equipo —backlog, ejercicios, roster,
  diagramas— en la carpeta `team-docs/`.
- Cada miembro trabaja en ramas de característica y abre *pull requests* a
  `main` de su repositorio.

**Pasos individuales** (cada miembro los ejecuta al menos una vez):

1. Clonar el repositorio de tu equipo en tu máquina local.
2. Crear una rama de característica con el patrón
   `feat/<tu-nombre>-kickoff-intro`.
3. Añadir un fichero pequeño (por ejemplo, tu nombre en un fichero
   `team-docs/members/<tu-nombre>.md`).
4. Confirmar los cambios con un mensaje en modo imperativo, subject line
   ≤ 72 caracteres (no usamos Conventional Commits hasta la Semana 08).
5. Publicar la rama en GitHub.
6. Abrir una *pull request* hacia `main` del repositorio del equipo,
   pegando la plantilla de
   [`exercises/03-pull-request-template.md`](./exercises/03-pull-request-template.md).
7. Otro miembro del equipo revisa y deja al menos un comentario sustantivo
   (pregunta, sugerencia o aprobación razonada).
8. Integrar la PR.

**Entregable**: URL de la PR fusionada de cada miembro, recogida en la
plantilla de verificación manual del profesorado.

**Criterio de aceptación**: cada miembro tiene al menos una PR fusionada;
cada PR incluye al menos un comentario de revisión sustantivo.

### Actividad 4 — Diagrama de contexto del sistema

**Objetivo**: el equipo produce su propio diagrama de contexto del sistema
con **Mermaid**, el único formato admitido.

**¿Qué necesitas?** Nada que instalar. Mermaid se escribe como texto plano en
un bloque ```` ```mermaid ```` y GitHub lo renderiza automáticamente en los
ficheros Markdown y en las *pull requests*. Para verlo localmente en VS Code
sigue la Actividad 0: las extensiones recomendadas están listadas en
`.vscode/extensions.json`. La plantilla de la actividad explica qué es
Mermaid y su sintaxis mínima.

**Elementos obligatorios en el diagrama**:

- Visitante público (`public-visitor`)
- Administrador (`administrator`)
- Backend Express (`express-backend`) — marcado como *alcance del alumnado*
- Servicio de IA (`ai-service`) — marcado como *caja negra* o
  *responsabilidad del profesorado*
- PostgreSQL (`postgresql`)
- Almacenamiento de PDF (`pdf-storage`)

Flechas con dirección clara para cada interacción.

**Entregable**: `team-docs/system-diagram.md` en el repositorio del equipo, con
el bloque ```` ```mermaid ```` escrito por el equipo. Sigue la plantilla
[`exercises/04-system-diagram-template.md`](./exercises/04-system-diagram-template.md).

**Criterio de aceptación**: los seis elementos presentes y etiquetados;
servicio de IA visiblemente marcado como caja negra; dirección de las
flechas inequívoca; el diagrama se renderiza en GitHub sin errores.

### Actividad 5 — Backlog inicial

**Objetivo**: dejar registrados, en una tabla sencilla, los ejercicios de la
semana y qué ha hecho cada miembro del equipo (responsabilidades).

**Entregable**: `team-docs/initial-backlog.md` en el repositorio del equipo,
siguiendo la plantilla
[`exercises/02-initial-backlog-template.md`](./exercises/02-initial-backlog-template.md).

**Criterio de aceptación**: cada ejercicio de la Semana 01 aparece con su
descripción breve y al menos un miembro responsable.

## Incremento semanal del proyecto

Al final de la Semana 01 cada equipo tiene:

- Su **repositorio de equipo** con la carpeta `team-docs/` que incluye
  al menos: `team-roster.md`, `environment-verification.md`,
  `initial-backlog.md` y `system-diagram.md`.
- Al menos **una PR fusionada por miembro** en el repositorio del equipo.
- Un **canal de comunicación** documentado y probado.

No se implementa código de backend esta semana. Comenzaremos con Node.js,
TypeScript y Express en la Semana 03.

## Criterios de aceptación

- [ ] Cada miembro ha ejecutado y presentado la salida de
  `node --version && git --version` con versiones mínimas satisfechas.
- [ ] El roster del equipo incluye 3–4 miembros con roles del Bloque 1
  asignados y cinco subsecciones de bloque preparadas.
- [ ] Cada miembro tiene al menos una PR fusionada a `main` del repositorio
  del equipo, con al menos un comentario de revisión.
- [ ] El diagrama de contexto contiene los seis elementos requeridos con el
  servicio de IA marcado como caja negra.
- [ ] El backlog de la semana recoge cada ejercicio con su descripción breve
  y quién lo ha hecho.
- [ ] Ningún elemento del backlog asigna al alumnado tareas internas del
  servicio de IA (OCR, embeddings, inferencia, etc.).

## Errores comunes y depuración

- **Síntoma**: `node --version` devuelve una versión < v20.19.
  **Causa habitual**: instalación antigua o gestor de versiones (nvm, fnm,
  volta) apuntando a una versión previa.
  **Cómo depurarlo**: instalar Node.js 22 LTS desde
  [nodejs.org](https://nodejs.org), o `nvm install 22 && nvm use 22`; volver
  a ejecutar el comando de verificación.

- **Síntoma**: `git push` pide usuario y contraseña, y las credenciales no
  funcionan.
  **Causa habitual**: GitHub ya no acepta autenticación por contraseña en
  HTTPS; se requiere un *Personal Access Token* o SSH.
  **Cómo depurarlo**: generar un *Personal Access Token* en GitHub y usarlo
  como contraseña, o configurar una clave SSH y usar la URL `git@github.com:`
  del repositorio.

- **Síntoma**: alguien del equipo cree que hay que implementar la búsqueda
  vectorial o los embeddings.
  **Causa habitual**: confusión sobre el límite backend/IA.
  **Cómo depurarlo**: volver al diagrama guiado y localizar la caja negra
  del servicio de IA; recordar la regla — "Todo lo que ocurre dentro de esa
  caja es responsabilidad del profesorado".

- **Síntoma**: alguien pregunta cómo se especifica "sobre qué documento" hace
  una pregunta el visitante.
  **Causa habitual**: expectativa incorrecta de que existen colecciones o
  sets de documentos.
  **Cómo depurarlo**: recordar la regla — "No existen conjuntos de
  documentos; las preguntas públicas buscan en todos los documentos activos".

## Resultados de aprendizaje DSW

> ⚠️ **Identificadores pendientes**: `references/dsw-learning-outcomes.md`
> está aún como PENDIENTE. Los identificadores de criterio siguen el patrón
> `RA1.CE-pending-N` hasta que se incorpore el texto oficial. Solo se
> actualizará el identificador y el texto abreviado; la actividad y la
> evidencia ya son válidas.

| RA | Criterio de evaluación | Evidencia esta semana |
|----|------------------------|------------------------|
| RA1 | `RA1.CE-pending-1` — *pendiente texto oficial* | Roster del equipo con 3–4 miembros y roles del Bloque 1 (Actividad 2) |
| RA1 | `RA1.CE-pending-2` — *pendiente texto oficial* | Diagrama de contexto del sistema con los 6 elementos y la caja negra explícita (Actividad 4) |
| RA1 | `RA1.CE-pending-3` — *pendiente texto oficial* | Backlog inicial 10–15 elementos con distribución por trimestre y cero `excluido-IA` (Actividad 5) |
| RA1 | `RA1.CE-pending-4` — *pendiente texto oficial* | Verificación individual del entorno con salida literal `node --version && git --version` (Actividad 1) |

Referencia normativa (pendiente):
[`references/dsw-learning-outcomes.md`](../../references/dsw-learning-outcomes.md).

## Autoevaluación

Responde a cada pregunta con **sí / con dudas / no**. Si respondes "con
dudas" o "no" a alguna, revisa la sección correspondiente antes de continuar
a la Semana 03.

- ¿Puedo explicar en dos frases qué hace el sistema Connectia?
- ¿Puedo enumerar las dos categorías de usuario del sistema?
- ¿Puedo explicar por qué el servicio de IA es una caja negra para nosotros?
- ¿Puedo justificar por qué **no** existen conjuntos de documentos?
- ¿Puedo justificar por qué las preguntas públicas **no** apuntan a un
  documento concreto?
- ¿Puedo ejecutar el comando de verificación del entorno y explicar cada
  parte de la salida?
- ¿Puedo describir el ciclo Git básico (clonar → rama → *commit* → *push* →
  PR → revisión → *merge*)?
- ¿Puedo defender por qué cada rol del equipo existe?

## Syllabus

Consulta [`syllabus/README.md`](./syllabus/README.md) para la lista de items que debes conocer al superar esta semana.
