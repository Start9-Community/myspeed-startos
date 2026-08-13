FROM germannewsmaker/myspeed:1.0.9

ARG ARCH

# The upstream image downloads these CLIs on first start. That makes the
# daemon hang before listening when a provider is unreachable. Download them
# during the image build instead, and verify the pinned release archives.
RUN apk add --no-cache tini wget ca-certificates tar gzip \
    && case "$ARCH" in \
      x86_64) \
        ookla_suffix='linux-x86_64' \
        ookla_sha='5690596c54ff9bed63fa3732f818a05dbc2db19ad36ed68f21ca5f64d5cfeeb7' \
        libre_suffix='linux_amd64' \
        libre_sha='8e6d020c17e11dba73f0eb8a11f7ae6e3d96cdb307faf3c0ec13aa54e0cba055' \
        ;; \
      aarch64) \
        ookla_suffix='linux-aarch64' \
        ookla_sha='3953d231da3783e2bf8904b6dd72767c5c6e533e163d3742fd0437affa431bd3' \
        libre_suffix='linux_arm64' \
        libre_sha='0ecbb98abb39f17bde2c0efae23f8446f4596c3a824aa6dda9b71723386b03ed' \
        ;; \
      *) echo "Unsupported package architecture: $ARCH" >&2; exit 1 ;; \
    esac \
    && mkdir -p /myspeed/bin \
    && wget -q -O /tmp/ookla.tgz "https://install.speedtest.net/app/cli/ookla-speedtest-1.2.0-${ookla_suffix}.tgz" \
    && echo "$ookla_sha  /tmp/ookla.tgz" | sha256sum -c - \
    && tar -xzf /tmp/ookla.tgz -O speedtest > /myspeed/bin/speedtest \
    && cp /myspeed/bin/speedtest /myspeed/bin/ookla \
    && wget -q -O /tmp/librespeed.tgz "https://github.com/librespeed/speedtest-cli/releases/download/v1.0.10/librespeed-cli_1.0.10_${libre_suffix}.tar.gz" \
    && echo "$libre_sha  /tmp/librespeed.tgz" | sha256sum -c - \
    && tar -xzf /tmp/librespeed.tgz -O librespeed-cli > /myspeed/bin/librespeed-cli \
    && chmod 0755 /myspeed/bin/speedtest /myspeed/bin/ookla /myspeed/bin/librespeed-cli \
    && rm -f /tmp/ookla.tgz /tmp/librespeed.tgz

ENTRYPOINT ["tini", "--"]
CMD ["node", "server"]
