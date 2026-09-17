# Base image is pinned to a digest for reproducible builds, as we only
# have access to Chainguard's free tier, which only ever publishes a
# rolling `latest` tag.
FROM cgr.dev/chainguard/wolfi-base:latest@sha256:1d95114038f76513a9ace6fca107d5582b08c65981f81f61cb56bf7fd2ef216d

# curl is pinned to an old, known version so Renovate's upcoming `apk add`
# support has a version to bump.
RUN apk add --no-cache curl=8.9.1-r4
