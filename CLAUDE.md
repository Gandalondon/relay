# Relay: rules for working in this repo

## Vercel and file sizes

1. Vercel serves only the `site/` folder (see `site/vercel.json`). It skips a deploy unless something in `site/` changed.
2. Never put marketing or portfolio assets in `site/`. They live in `marketing/` (portfolio screens, GIFs) or `android-release/` (Play icon, screenshots, feature graphic), which Vercel never sees.
3. Keep every file in `site/` under 5 MB, and the whole of `site/` under 50 MB. If an image is bigger, compress it or resize it for the web before it goes in. The "Site size check" GitHub Action fails any push that breaks this.
4. Android builds go to GitHub Releases (for Obtainium), never to a branch. Do not commit APKs or app bundles to the repo.

## Runtime downloads

5. Every file the app downloads at runtime (voices, models, data packs) must have a copy we host: a release on Gandalondon/relay, made by a workflow like `.github/workflows/mirror-voice.yml` with the file's SHA-256 checked. The app tries our copy first and the original source second. Never ship a build that depends only on someone else's download link. Mirror releases are prereleases with make_latest off, so Obtainium ignores them.
