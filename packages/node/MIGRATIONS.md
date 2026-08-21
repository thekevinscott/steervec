# Migrations

## Unreleased

### Summary

The npm package shipped a binary that reported the wrong version — `0.0.3`
answered `--version` with `0.0.1`. Cross-compilation moved from this package's
build script to putitoutthere's bundled-cli recipe, which stamps the crate
version before building. Nothing in the package's own API changed.

### Required changes

None.

### Deprecations removed

None.

### Behavior changes without code changes

- `steervec --version` reports the version you installed. Anything that parsed
  that string to detect the installed release was reading a stale number.
- Linux binaries now target a glibc 2.17 floor (`cargo zigbuild`), so they run
  on older distributions than the previous CI-runner-glibc builds did.
- The binary moved to the platform-package root, from
  `@steervec/<triple>/bin/steervec` to `@steervec/<triple>/steervec`. Only
  affects anything resolving that path directly instead of running the `steervec`
  bin entry.

### Verification

```
$ npm install -g steervec
$ steervec --version
steervec <the version npm just installed>
```
