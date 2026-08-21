# Changelog

## Unreleased

### Fixed

- The installed binary reported the previous release's version: `steervec@0.0.3`
  answered `--version` with `steervec 0.0.1`. The per-target binaries were
  cross-compiled by this package's own build script, which baked
  `CARGO_PKG_VERSION` in from an unbumped `packages/rust/Cargo.toml`.
  putitoutthere now owns the cross-compile (`[package.bundle_cli]` in
  `putitoutthere.toml`), so the crate version is stamped before `cargo build`.

### Changed

- Platform packages carry the binary at their root
  (`@steervec/<triple>/steervec`) rather than under `bin/`, matching where the
  engine stages and packages it. The launcher passes `binaryDir: ''`, which
  needs `bin-shim@>=0.2.1`.
- Linux binaries are built with `cargo zigbuild` against a pinned glibc 2.17
  floor rather than whatever the CI runner ships, widening the range of
  distributions they run on.
- Dropped the pre-committed `optionalDependencies`. The engine rewrites them at
  publish; the pinned `0.0.1` entries only ever produced lockfile drift.
