# MySpeed

## Documentation

- [MySpeed upstream documentation](https://docs.myspeed.dev/) — the official MySpeed user guide, covering speed test providers, scheduling, notifications, and integrations.

## What you get on StartOS

- **A web UI** for running, scheduling, and reviewing internet speed tests.
- **Persistent history** stored in a SQLite database under the package's `main` volume, so test results and configuration survive restarts and are included in StartOS backups.
- **Scheduled speed tests** that run automatically on a Cron expression you control from the MySpeed UI.

## Getting set up

1. Open MySpeed's **Dashboard** tab and click the **Web UI** interface.
2. Complete the **welcome dialog** that appears on first launch — this is where you set the admin password and choose initial preferences.
3. Pick a speed test provider (Ookla, LibreSpeed, or Cloudflare) and, if you want, adjust the Cron schedule. MySpeed begins running tests automatically once you've finished the welcome flow.

## Using MySpeed

### Web interface

After you set the admin password, the Web UI lands on the MySpeed dashboard. From there you can:

- Run an on-demand speed test.
- Browse past results and statistics for download, upload, and ping.
- Configure providers, servers, schedule, data retention, notification channels (Discord, Gotify, Pushover, Telegram, webhooks), and the Prometheus metrics endpoint — all from MySpeed's own settings pages.

All MySpeed configuration lives in the Web UI; this package does not expose StartOS-side configuration actions.

## Limitations

- Speed tests run through the container's network stack, so results may differ slightly from a bare-metal test on the same connection.
- If you lose the admin password, the only recovery path is to clear it directly from the SQLite database in the `main` volume — there is no in-UI password reset.
