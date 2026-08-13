<p align="center">
  <img src="icon.svg" alt="MySpeed Logo" width="21%">
</p>

# MySpeed on StartOS

> **Upstream docs:** <https://docs.myspeed.dev/>
>
> Everything not listed in this document should behave the same as upstream
> MySpeed. If a feature, setting, or behavior is not mentioned
> here, the upstream documentation is accurate and fully applicable.

MySpeed is a speed test analysis software that records your internet speed for up to 30 days. It automates speed tests using Cron expressions and generates clear statistics on speed, ping, and more. See the [upstream repo](https://github.com/gnmyt/myspeed) for general MySpeed documentation.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                                 |
| ------------- | ----------------------------------------------------- |
| Image         | Custom Dockerfile extending `germannewsmaker/myspeed` |
| Architectures | x86_64, aarch64                                       |
| Entrypoint    | `tini -- node server`                                 |

The custom Dockerfile adds [tini](https://github.com/krallin/tini) as an init process to handle SIGTERM signals for clean shutdown. The upstream image does not handle signals gracefully on its own.

It also bundles the Ookla and LibreSpeed CLI binaries into `/myspeed/bin` at build time, pinned by version and verified by SHA-256. Upstream downloads them on start and blocks the server from listening until that finishes, so an unreachable `install.speedtest.net` left the service permanently failing its health check. Both `speedtest` and `ookla` names are provided: MySpeed's loader probes `bin/ookla` but runs `bin/speedtest`.

## Volume and Data Layout

| Volume | Mount Point     | Purpose                                           |
| ------ | --------------- | ------------------------------------------------- |
| `main` | `/myspeed/data` | All MySpeed data (SQLite database, configuration) |

## Installation and First-Run Flow

1. MySpeed starts with a fresh SQLite database
2. On first visit to the web UI, a **welcome dialog** is displayed where you can configure initial settings and set a password
3. Speed tests begin automatically based on the default Cron schedule

No StartOS-specific setup steps are required. All configuration is done through MySpeed's own web UI.

## Configuration Management

All MySpeed settings are managed through the **upstream web UI** — there are no StartOS-managed settings or actions.

Settings available in the MySpeed UI include:

| Category          | Settings                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| **Speed Test**    | Test provider (Ookla, LibreSpeed, Cloudflare), server selection, Cron schedule, data retention period |
| **Network**       | Interface selection for speed tests                                                                   |
| **Notifications** | Discord, Gotify, Pushover, Telegram, webhooks, health check monitoring                                |
| **Monitoring**    | Prometheus metrics endpoint, Grafana integration                                                      |
| **Security**      | Admin password                                                                                        |

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose                        |
| --------- | ---- | -------- | ------------------------------ |
| Web UI    | 5216 | HTTP     | MySpeed dashboard and settings |

## Actions (StartOS UI)

None. MySpeed is fully managed through its own web interface.

## Backups and Restore

**Backed up:** The entire `main` volume, including the SQLite database and all configuration.

**Restore behavior:** Restoring overwrites current data with the backup copy, including speed test history and settings.

## Health Checks

| Check             | Method                            | Grace Period | Messages                            |
| ----------------- | --------------------------------- | ------------ | ----------------------------------- |
| **Web Interface** | `checkPortListening` on port 5216 | 30 seconds   | Ready: "The web interface is ready" |

The 30-second grace period accommodates MySpeed's startup time, during which it loads integrations and performs network discovery.

## Dependencies

None. MySpeed is a standalone service.

## Limitations and Differences

1. **Custom Dockerfile with tini** — adds an init process for proper signal handling; the upstream image does not handle SIGTERM gracefully
2. **No StartOS-managed configuration** — all settings (password, test schedule, notifications, etc.) are configured through MySpeed's own web UI
3. **No password reset action** — if the admin password is forgotten, the only recovery method is clearing it from the SQLite database
4. **Speed test accuracy** — tests run through the container's network stack, which may differ slightly from bare-metal results
5. **Startup takes a few seconds** — MySpeed performs network discovery and integration loading on each start
6. **Speed test CLIs are baked into the image** — Ookla 1.2.0 and LibreSpeed 1.0.10 ship in the image rather than being downloaded on start, so the pins advance with the image rather than with upstream's `server/config/binaries.js` (see `UPDATING.md`)

## What Is Unchanged from Upstream

- Speed test execution (Ookla, LibreSpeed, Cloudflare)
- Statistics dashboard and data visualization
- Cron-based test scheduling
- Multi-server support
- Notification integrations (Discord, Gotify, Pushover, Telegram, webhooks)
- Health check monitoring (email, Signal, WhatsApp, Telegram)
- Prometheus metrics endpoint
- Grafana integration
- Admin password protection
- Data retention settings
- SQLite database storage

## Contributing

Build and development workflow follow the StartOS packaging guide: <https://docs.start9.com/packaging>. Keep `README.md`, `instructions.md`, and `AGENTS.md` in sync with any change to user-visible behavior or package structure.

---

## Quick Reference for AI Consumers

```yaml
package_id: my-speed
image: custom Dockerfile (germannewsmaker/myspeed + tini + bundled speed-test CLIs)
architectures: [x86_64, aarch64]
volumes:
  main: /myspeed/data
ports:
  ui: 5216
dependencies: none
startos_managed_env_vars: none
actions: none
health_checks:
  - checkPortListening:5216: web_interface (30s grace period)
backup_volumes:
  - main (full volume)
configuration: upstream web UI only
auth: password set via upstream web UI welcome dialog
```
