# Agent Instructions

## connectia-teachers is the source of truth

This repository is the **student-facing** material for the Connectia course. It
is a derived subset of `connectia-teachers`, which lives in a sibling
repository (`../connectia-teachers`) and is the **single source of truth** for
every topic's content: READMEs, exercises, syllabus, example code, and assets.

This repo must **always be kept up to date with `connectia-teachers`**. It must
never define or preserve its own version of a topic:

- When a topic changes in `connectia-teachers`, copy it here so the student
  copy is identical to the teacher copy.
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
3. Mirror the teacher copy exactly:
   `rsync -a --delete --exclude=node_modules --exclude=dist --exclude=.env \
   --exclude=coverage ../connectia-teachers/topics/<topic>/ topics/<topic>/`.
4. Commit the sync.

## No student-facing adaptations

Every published topic folder must be an **exact copy** of the same folder in
`connectia-teachers` — including terminology ("Topic"), teacher session
notes, diagram formats, and example code. Do not adapt, rename, reformat, or
"fix" anything here; if something is wrong, fix it in `connectia-teachers`
first and then sync.

The only files that belong to this repository alone are the ones that list
what is published: the root `README.md`, `topics/README.md`, and
`.vscode/extensions.json` (which must match `connectia-teachers`).
