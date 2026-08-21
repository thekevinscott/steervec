#!/usr/bin/env node
import { main } from 'bin-shim';

main({
  scope: 'steervec',
  binaryName: 'steervec',
  from: import.meta.url,
  platformPackage: '@{scope}/{triple}',
  // putitoutthere's bundled-cli recipe stages the binary at the platform
  // package root, with no `bin/` segment. bin-shim defaults to `bin`.
  binaryDir: '',
  triples: {
    'linux-x64': 'x86_64-unknown-linux-gnu',
    'linux-arm64': 'aarch64-unknown-linux-gnu',
    'darwin-x64': 'x86_64-apple-darwin',
    'darwin-arm64': 'aarch64-apple-darwin',
    'win32-x64': 'x86_64-pc-windows-msvc',
  },
})
  .then((code) => process.exit(code))
  .catch((err: Error) => {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  });
