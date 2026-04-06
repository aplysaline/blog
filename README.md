# aplysaline

Minimal Astro blog boilerplate with markdown posts compiled as a static site.

This repository uses Bun only. Dependency installs and project scripts should be run with Bun, not npm, pnpm, or Yarn.
Astro 6 in this repo also requires Node.js `>=22.12.0` anywhere Bun invokes Astro tooling, including GitHub Actions.

Posts live in `src/data/blog/` and are loaded into an Astro content collection at build time.

Draft posts stay hidden by default. To preview them locally while keeping production builds unchanged, run:

`DRAFT=true bun run dev`

Any `DRAFT` value is treated as enabled except empty, `0`, `false`, and `none`, so `DRAFT=1 bun run dev` works too. The flag is only honored in Astro's local dev mode, so `bun run build`, `bun run preview`, and deployed production output still exclude posts with `draft: true`.

## Bun workflow

- `bun install`
- `bun run dev`
- `bun run build`
- `bun run serve:dist`
- `bun run preview`
- `bun run check`
- `bun run lint`
- `bun run test`
- `bun run feedback`

Use `bun run serve:dist` after building if you want to test the generated `dist/` output locally without running Astro's dev server. This uses a small Bun-native static server in `scripts/serve-dist.ts`, so it stays Bun-only and does not rely on an extra package.

`bun run feedback` runs typechecking, building, linting, and tests in parallel, then prints a single timing summary when everything passes. If something fails, it prints a compact summary plus the focused diagnostics for the failing task(s) only.

The repo is set up to make this explicit in three places:

- `packageManager` is pinned to Bun in `package.json`
- `bun.lock` is the committed lockfile
- `preinstall` blocks installs from other package managers

## GitHub Pages deployment

Live site: `https://aplysaline.github.io/blog/`

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that:

- installs dependencies with Bun
- runs `bun run check`
- runs `bun run lint`
- runs `bun run test`
- builds the static site
- deploys the generated `dist/` directory to GitHub Pages

For this repository's current remote (`aplysaline/blog`), production builds automatically use the correct GitHub Pages base path of `/blog`. If the repository is ever renamed or moved to a `username.github.io` repository, the Astro config derives the correct Pages URL from the GitHub Actions environment at build time.

To finish enabling deployment in GitHub:

1. Open the repository settings on GitHub.
2. Go to `Settings > Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` or run the workflow manually from the Actions tab.
