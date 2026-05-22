# Changelog

All notable changes to `velora-web` will be documented in this file.

This project follows a clean-start changelog policy for Velora branding and scope.

## Unreleased

### Added

- `AGENTS.md` and `docs/DESIGN.md` for UI direction and agent handoff
- Unified `VeloraNavbar` (Nestar layout, sticky, responsive drawer)
- Immersive home hero with tabbed backgrounds (Hotel / Flights / RentCar) and overlapping search card
- `libs/data/heroBackgrounds.ts` for hero slide images

### Changed

- Home layout: navbar overlay + full-bleed hero; inner pages use contrast navbar
- Login, register, join: no navbar or chat on auth pages
- `README.md` updated with project-specific setup and doc links
