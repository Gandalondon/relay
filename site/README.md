# Relay site (getarcrelay.app)

- `index.html`: the homepage. The old holding page is kept in tools/hero/holding-page-12nov.html.
- The full site lives at the root (live 12 Nov 2026). /beta/* redirects to the same page at the root (vercel.json), so old links and the app keep working.
- `fonts/`: Inter Tight (SIL Open Font Licence), served from here, not Google Fonts.
- Vercel: project root directory is `site/`, no build step. Pushes that only touch `site/` don't build the APK.
- Every page with a map credits MetaForge at the bottom (their condition, 1 Nov 2026).
- Domain getarcrelay.app is on the existing Vercel project "arcrelay" (Ganda team, Hobby), root directory site/.
