<p align="center">
  <img src="icon.png" alt="MySpeed Logo" width="21%">
</p>

# MySpeed on StartOS

> Everything not listed in this document should behave the same as upstream
> MySpeed. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[MySpeed](https://github.com/gnmyt/myspeed) runs internet speed tests on a schedule and keeps the history, so you can see what your connection actually delivers over time. This package runs it with the speed-test binaries already in the image rather than fetched at first start.

- **Upstream repo:** <https://github.com/gnmyt/myspeed>
- **Wrapper repo:** <https://github.com/Start9-Community/myspeed-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, built here on top of a published MySpeed image.

| Property      | Value                               |
| ------------- | ----------------------------------- |
| Image         | Built from this repo's `Dockerfile` |
| Architectures | x86_64, aarch64                     |
| Command       | The application, under `tini`       |

| Subcontainer | Purpose                                  |
| ------------ | ---------------------------------------- |
| `main`       | The only daemon — the one to `attach` to |

**The build exists to bake in the speed-test CLIs.** The base image downloads Ookla's and LibreSpeed's clients on first start, which means the daemon hangs before it ever listens if either download is slow or blocked. Here they are fetched at build time from pinned release archives and **verified against a recorded SHA-256** — so the build fails rather than shipping an unexpected binary, and the runtime start does no downloading at all.

The daemon runs with `runAsInit` so `tini` is PID 1 and reaps the short-lived test processes it spawns.

## Volume and Data Layout

One volume, holding everything.

| Volume | Mount Point     | Purpose                                   |
| ------ | --------------- | ----------------------------------------- |
| `main` | `/myspeed/data` | The database — results, settings, account |

MySpeed keeps its whole state in a SQLite database on that volume: the test history, the schedule, the provider choice, the notification channels, and the admin password hash.

## File Models

**None.** Nothing here is configured through a file this package manages — all of it is set inside MySpeed's own interface and stored in its database.

## Dependencies

None.

**The service does need internet**, since a speed test is a transfer against a remote server. Which servers depends on the provider chosen in the interface.

## Network Access and Interfaces

One interface.

| Interface | Id   | Type | Port | Description               |
| --------- | ---- | ---- | ---- | ------------------------- |
| Web UI    | `ui` | ui   | 5216 | The MySpeed web interface |

Bound on the `ui-multi` MultiHost over HTTP and not masked. **MySpeed's own login gates it** — the password set in the welcome dialog on first launch — and StartOS adds no gate of its own.

Outbound, the service reaches whichever speed-test provider is selected, plus any notification service configured in the interface. **A speed test necessarily reveals your IP address to the provider** running the other end of it.

## Installation and First-Run Flow

Install does nothing beyond creating the volume: there is no seeding, no task, and no credential generated here.

**The first-run setup is MySpeed's own.** Opening the interface presents a welcome dialog that sets the admin password and the initial preferences; tests begin on the schedule once it is completed.

The service starts and reports healthy before that has happened — the check watches the port, and an unconfigured MySpeed is still serving.

## Actions

**None.** The package ships an empty action set: everything MySpeed does is configured from its own interface.

That includes the admin password, which has one consequence worth knowing before it bites: **there is no reset action, and MySpeed has no in-app reset either**. Recovering from a lost password means clearing it out of the SQLite database on the volume by hand.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

One check, on the only daemon.

| Check     | Displayed as    | Method                 | Grace |
| --------- | --------------- | ---------------------- | ----- |
| `primary` | "Web Interface" | Port 5216 is listening | 30s   |

It reports that the interface is serving. **It says nothing about the tests**: a failing provider, a broken schedule, or a connection that has been down for a week all show a green check, and are visible in the interface's own history.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`, which is the SQLite database and therefore the entire application state.

**The backup holds the full test history** along with the settings and the account, so a restore comes back with the graph intact rather than starting over. It also holds any notification credentials entered in the interface.

Nothing in that state is tied to the server it ran on, so a restore needs no reconfiguration.

## Limitations and Differences

1. **No StartOS-side configuration.** No actions, no file models — everything is in MySpeed's interface.
2. **A lost admin password cannot be reset** except by editing the database directly.
3. **Results are measured from inside a container**, so they can differ slightly from a bare-metal test on the same line.
4. **Speed tests are third-party transfers** and disclose your IP to the provider you select.
5. **The speed-test clients are pinned at build time**, so updating them is a package change rather than something the application does for itself.
6. **The image is a third-party build** of MySpeed, not the upstream project's own publication.

---

## Quick Reference for AI Consumers

```yaml
package_id: my-speed # note: the repo is myspeed-startos
image: built from ./Dockerfile # FROM a published MySpeed image, plus pinned speedtest CLIs
architectures:
  - x86_64
  - aarch64
subcontainers:
  - main # runAsInit: true, tini as PID 1
volumes:
  main: /myspeed/data # SQLite: history, settings, notification channels, admin password
file_models: [] # nothing is managed by the package
startos_managed_env_vars: []
dependencies: [] # but speed tests require internet
interfaces:
  ui: { type: ui, port: 5216 } # MySpeed's own login; no gate added by StartOS
actions: []
tasks: []
health_checks:
  - primary # displayed "Web Interface"; says nothing about test results
```
