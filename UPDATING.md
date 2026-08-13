# Updating the upstream version

The `main` image is built locally from `Dockerfile`, which pins a third-party rebuild of MySpeed published to Docker Hub as [`germannewsmaker/myspeed`](https://hub.docker.com/r/germannewsmaker/myspeed). Tags on that image track upstream MySpeed releases at [`gnmyt/myspeed`](https://github.com/gnmyt/myspeed) (Docker `1.0.9` ↔ GitHub `v1.0.9`).

## Determining the upstream version

- **Upstream MySpeed releases** ([gnmyt/myspeed](https://github.com/gnmyt/myspeed)) — authoritative source for "is there a new version":

  ```sh
  gh release view -R gnmyt/myspeed --json tagName -q .tagName
  ```

  Not pinned directly in this repo; this is the version a new bump targets.

- **`germannewsmaker/myspeed` Docker Hub tags** ([Docker Hub](https://hub.docker.com/r/germannewsmaker/myspeed/tags)) — the actual image the package pulls; confirm the matching tag exists here before bumping:

  ```sh
  curl -fsSL "https://hub.docker.com/v2/repositories/germannewsmaker/myspeed/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```

  Pinned in `Dockerfile` on the `FROM germannewsmaker/myspeed:<version>` line. Strip the leading `v` from the GitHub tag (GitHub `v1.0.9` → Docker `1.0.9`).

- **Bundled speed-test CLIs** — the `Dockerfile` downloads the Ookla and LibreSpeed CLIs at build time and pins each by version and SHA-256, because MySpeed otherwise fetches them on start and blocks the web server until it finishes. The versions must match the ones the image expects, which MySpeed keeps in `server/config/binaries.js`:

  ```sh
  docker run --rm --entrypoint sh germannewsmaker/myspeed:<version> \
    -c 'grep Version /myspeed/server/config/binaries.js'
  ```

  MySpeed only downloads a CLI when its binary is absent, so a stale pin doesn't break the build — it silently keeps the old CLI. Check this on every image bump.

## Applying the bump

- **`Dockerfile`** — update the `FROM germannewsmaker/myspeed:<version>` line to the new tag.
- **`Dockerfile`** — if `binaries.js` moved either CLI, update that version in the download URL and recompute both per-arch checksums:

  ```sh
  for s in linux-x86_64 linux-aarch64; do
    curl -fsSL "https://install.speedtest.net/app/cli/ookla-speedtest-<ver>-$s.tgz" | sha256sum
  done
  for s in linux_amd64 linux_arm64; do
    curl -fsSL "https://github.com/librespeed/speedtest-cli/releases/download/v<ver>/librespeed-cli_<ver>_$s.tar.gz" | sha256sum
  done
  ```

  Ookla's archive extracts as `speedtest`; the image needs it under both `bin/speedtest` (what MySpeed executes) and `bin/ookla` (what its loader probes).
