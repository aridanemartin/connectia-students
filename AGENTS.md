# Agent Instructions

## connectia-teachers is the source of truth

This repository is the **student-facing** material for the Connectia course. It
is a derived subset of `connectia-teachers`, which lives in a sibling
repository (`../connectia-teachers`) and is the **single source of truth** for
every topic's content: READMEs, exercises, syllabus, example code, and assets.

This repo must **always be kept up to date with `connectia-teachers`**. It must
never define or preserve its own version of a topic:

- When a topic changes in `connectia-teachers`, port the change here so the
  student copy matches the teacher copy on content and facts.
- Before editing a topic here, check `connectia-teachers` for its current
  version first (paths `topics/topic-NN-*/`), not from memory of a prior
  version.
- If this repo's material and `connectia-teachers` ever diverge on substance,
  `connectia-teachers` wins — update this repo to match it, never the other way
  around, and never invent a parallel "legacy" or "simplified" version to work
  around a mismatch.

### Workflow

1. `git -C ../connectia-teachers fetch && git -C ../connectia-teachers status`
   to confirm the source repo is on `main` and up to date.
2. Compare the topic folders:
   `diff -rq --exclude=node_modules --exclude=dist --exclude=.env \
   ../connectia-teachers/topics/<topic> topics/<topic>`.
3. Bring the student copy in line with the teacher copy, preserving only the
   deliberate student-facing adaptations below.
4. Commit the sync.

## Deliberate student-facing adaptations

These differences from `connectia-teachers` are intentional and must be kept
(do not "fix" them while syncing):

- Terminology is **"Semana" / "week"** for the student audience, even though
  `connectia-teachers` calls them **Topics**. Folder names stay
  `topic-NN-*` in both repos.
- Teacher-only sections (e.g. *"Notas de sesión para el profesorado"*) are
  removed and replaced with a link to the topic's `syllabus/README.md`.
- Diagrams are shipped as standalone `.mmd` files (and previewed in VS Code),
  rather than mermaid blocks inside `.md` files.

Everything else — exercise steps, facts, cross-references to other topics,
example code, and assets — must match `connectia-teachers` exactly.
