# Base image is pinned to a digest for reproducible builds, as we only
# have access to Chainguard's free tier, which only ever publishes a
# rolling `latest` tag.
FROM cgr.dev/chainguard/wolfi-base:latest@sha256:96ff486b326d15db16aa1fbd41a17043a557bebf76d2c0ac932e717534025940

# curl is pinned to an old, known version so Renovate's upcoming `apk add`
# support has a version to bump.
RUN apk add --no-cache curl=8.18.0-r3
