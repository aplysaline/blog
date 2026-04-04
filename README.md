# aplysaline

Minimal Astro blog boilerplate with markdown posts compiled as a static site.

This repository uses Bun only. Dependency installs and project scripts should be run with Bun, not npm, pnpm, or Yarn.

Posts live in `src/data/blog/` and are loaded into an Astro content collection at build time.

## Bun workflow

- `bun install`
- `bun run dev`
- `bun run build`
- `bun run serve:dist`
- `bun run preview`
- `bun run check`
- `bun run test`

Use `bun run serve:dist` after building if you want to test the generated `dist/` output locally without running Astro's dev server. This uses a small Bun-native static server in `scripts/serve-dist.ts`, so it stays Bun-only and does not rely on an extra package.

The repo is set up to make this explicit in three places:

- `packageManager` is pinned to Bun in `package.json`
- `bun.lock` is the committed lockfile
- `preinstall` blocks installs from other package managers

## GitHub Pages deployment

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that:

- installs dependencies with Bun
- runs `bun run check`
- runs `bun run test`
- builds the static site
- deploys the generated `dist/` directory to GitHub Pages

For this repository's current remote (`aplysaline/blog`), production builds automatically use the correct GitHub Pages base path of `/blog`. If the repository is ever renamed or moved to a `username.github.io` repository, the Astro config derives the correct Pages URL from the GitHub Actions environment at build time.

To finish enabling deployment in GitHub:

1. Open the repository settings on GitHub.
2. Go to `Settings > Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` or run the workflow manually from the Actions tab.
