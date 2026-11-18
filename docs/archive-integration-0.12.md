# Archive integration checks — 0.12.0

`npm run check:archives` exercises all five templates through CLI `init`, `validate`, and `pack`, then reads the actual `.r1` ZIP with Python standard library. It verifies archive CRC, root-relative paths, exact file inventory, manifest consistency, icon, entrypoint, README, and LICENSE. Negative tests cover missing icons and output placed inside the source directory.

Requirements: Node.js >=18 and `python3` on PATH. On Android shared storage, run these commands without installing local npm dependencies.

These are **local packaging tests**, not proof of installation, activation, permissions, or execution in the Android host. Android runtime testing is still required before stable release.
