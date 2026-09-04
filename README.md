# apk-add-docker

Reproduction repo for testing Renovate's upcoming support for updating
pinned `apk add` package versions in Dockerfiles.

Related context:

- [renovatebot/renovate#5422](https://github.com/renovatebot/renovate/issues/5422)
  - the original feature request for native `apk add` support
- [renovatebot/renovate#37317](https://github.com/renovatebot/renovate/discussions/37317)
  - more recent discussion of the same problem
- [Updating `apk add` definitions in Dockerfiles](https://www.jvt.me/posts/2025/03/24/renovate-regex-dockerfile-apk/)
  - the `customManagers`/`renovate-apk-indexer` workaround used before native
    support exists. This repo isn't using that workaround - it's here so
    the native manager, once it lands, has real fixtures to update instead.

## Fixtures

All three Dockerfiles use `cgr.dev/chainguard/wolfi-base`, since that's the
image we use to get an `apk` binary with the Wolfi/Chainguard package set.

- `Dockerfile` - the minimal case: one base image, one pinned package
  (`curl`).
- `Dockerfile.multi` - a single `apk add` split across continuation lines,
  mixing pinned and unpinned packages, plus unrelated `ENV` lines nearby.
  This is closer to a real-world Dockerfile, and checks that whatever
  parses `apk add` doesn't get confused by line continuations or by
  `ENV KEY=value` lines that look superficially similar to `pkg=version`.
- `Dockerfile.multistage` - two stages, each with their own `apk add`, to
  check updates are scoped per-stage rather than only matching the first
  `RUN` in the file.

## Pinning

We're on Chainguard's free tier, which only ever publishes a rolling
`latest` tag per image - there's no `curl:8.10.1` tag to pull, and the
digest behind `latest` changes whenever Chainguard rebuilds it. To keep
these fixtures reproducible we pin both:

- the base image, by digest (`FROM ...@sha256:...`) - this is what
  Renovate's existing `dockerfile` manager already updates today
- the `apk` package, by exact version (`pkg=X.Y.Z-rN`) - this is what the
  new manager needs to detect and update

Versions were the current/older entries in the public
[Wolfi package index](https://packages.wolfi.dev/os/x86_64/APKINDEX.tar.gz)
at the time of writing (2026-09-04), e.g. `curl` was pinned to `8.9.1-r4`
against a latest of `8.22.0-r0`, so there's an upgrade for Renovate to
find. The base image digest was resolved with
`crane digest cgr.dev/chainguard/wolfi-base:latest`.

Because the free tier is rolling, the pinned base image digest here will
go stale (the tag will eventually point elsewhere, and old digests get
garbage collected). That's expected and not something to "fix" - if you
need it working again, re-resolve it with `crane digest` and repin. The
package version pins won't go stale in the same way, since old `apk`
package builds stay in the index.

## Testing locally

```sh
RENOVATE_CONFIG_FILE=config.js LOG_LEVEL=debug renovate --platform=local
```
