You are running the **impeccable** design skill.

Sub-command: $ARGUMENTS

## Step 1 — Load the skill

Read the full skill definition from `.claude/skills/impeccable/SKILL.md` and follow its setup instructions exactly.

## Step 2 — Run context script

Run the context script to load the project design context:

```
node .claude/skills/impeccable/scripts/context.mjs
```

## Step 3 — Load sub-command reference

If a sub-command was provided (e.g. `init`, `audit`, `polish`, `critique`, `craft`, etc.), read the matching reference file:

`.claude/skills/impeccable/reference/<sub-command>.md`

Then execute that sub-command's flow as described in the reference file.

If no sub-command was provided, default to `init`.
