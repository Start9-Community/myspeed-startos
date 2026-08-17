# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `my-speed`, not `myspeed`** — the repo name and the id differ.
- **`runAsInit: true` keeps `tini` as PID 1**, which reaps the per-test child processes MySpeed spawns.
- **There is nothing for the package to configure.** No file models, no actions — MySpeed keeps everything in its SQLite database, including the admin password hash, and offers no reset. Don't add a "reset password" action without first confirming a supported way to do it; poking the database from a oneshot is not one.
