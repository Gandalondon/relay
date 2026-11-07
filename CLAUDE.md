# Relay: rules for working in this repo

## Vercel and file sizes

1. Vercel serves only the `site/` folder (see `site/vercel.json`). It skips a deploy unless something in `site/` changed.
2. Never put marketing or portfolio assets in `site/`. They live in `marketing/` (portfolio screens, GIFs) or `android-release/` (Play icon, screenshots, feature graphic), which Vercel never sees.
3. Keep every file in `site/` under 5 MB, and the whole of `site/` under 50 MB. If an image is bigger, compress it or resize it for the web before it goes in. The "Site size check" GitHub Action fails any push that breaks this.
4. Android builds go to GitHub Releases (for Obtainium), never to a branch. Do not commit APKs or app bundles to the repo.
