# Verificación del entorno

Este comando comprueba que tu equipo tiene las versiones mínimas de Node.js
y Git para trabajar en el proyecto.

## Comando de verificación

### macOS / Linux (bash o zsh)

```bash
node --version && git --version
```

### Windows PowerShell

```powershell
node --version; git --version
```

### Salida esperada (ejemplo)

```text
v22.12.0
git version 2.42.0
```

## Versiones mínimas

| Herramienta | Mínimo | Recomendado |
|-------------|--------|-------------|
| Node.js | v20.19.0 | v22 LTS |
| Git | 2.0.0 | 2.42+ |

## Cómo capturar la evidencia

1. Ejecuta el comando en una terminal.
2. Copia **literalmente** las dos líneas de salida.
3. Pégalas dentro del bloque `text` correspondiente a tu nombre en la
   plantilla
   [`../exercises/01-environment-verification-template.md`](../exercises/01-environment-verification-template.md).

## ¿Tu versión es insuficiente?

- **Node.js < v20.19**: descarga Node.js 22 LTS desde
  [nodejs.org](https://nodejs.org) o usa un gestor de versiones (`nvm`,
  `fnm`, `volta`) y ejecuta `nvm install 22 && nvm use 22`.
- **Git < 2.0**: instala la versión más reciente de Git desde
  [git-scm.com](https://git-scm.com) para tu sistema operativo.

## ¿No puedes instalar en tu equipo?

Habla con el profesorado. Los equipos de aula tienen Node.js y Git
preinstalados y son un plan B válido para este topic.
