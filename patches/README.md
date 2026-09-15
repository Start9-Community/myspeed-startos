# Carried patches

Deltas applied to the `/myspeed` tree of the pinned `germannewsmaker/myspeed` image at build
time, in filename order, by the `patch -p1 --fuzz=0` step in the [Dockerfile](../Dockerfile).
`--fuzz=0` is deliberate: after an image bump a patch whose context has changed must fail the
build, not apply anyway with the mismatch ignored.

Each patch here is a liability — it forks the shipped application from the upstream release the
image tag names, and every image bump has to re-validate it. Add one only when the alternative is
shipping a known defect, and record below what retires it.

## 0001 — accept Gotify v3 application tokens

**Retire when:** the pinned image carries a MySpeed release whose Gotify `key` field accepts tokens
longer than 15 characters. Tracked upstream at
[gnmyt/myspeed#1608](https://github.com/gnmyt/myspeed/issues/1608), with the same one-line fix
open as [gnmyt/myspeed#1613](https://github.com/gnmyt/myspeed/pull/1613); neither `v1.0.9` (the
current pin) nor `development` had it as of 2026-09-15.

MySpeed validates the Gotify integration's `key` field with `/^.{15}$/` — exactly 15 characters,
the length of a Gotify v2 application token. Gotify v3 issues `gtfya.`-prefixed tokens of about 52
characters, so the settings form rejects every token a current Gotify server can produce and the
integration cannot be configured at all ([#7](https://github.com/Start9-Community/myspeed-startos/issues/7)).

The patch relaxes the field to `/^.{15,}$/`. The regex is enforced only in
`server/controller/integrations.js`, which also serves it to the web client, so the one file
covers both the API and the form.
