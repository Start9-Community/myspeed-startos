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

## Applying the bump

- **`Dockerfile`** — update the `FROM germannewsmaker/myspeed:<version>` line to the new tag.
