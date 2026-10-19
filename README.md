# PoisePal marketing site

Landing site for **PoisePal**, a discreet AI interview coach for job candidates. Sibling product to Closewing (sales), but a separate brand, repo, and domain.

Static site: Vite + vanilla TypeScript. No backend, no cookies, no third-party scripts.

```bash
npm install
npm run dev         # local dev server
npm run build       # type-check + build to dist/
npm run preview     # serve dist/ on http://localhost:4173
```

## Hosting plan
Same pattern as the Closewing site: **GitHub Pages** project site at `https://<user>.github.io/poisepal-site/` (`vite.config.ts` `base: '/poisepal-site/'`). Optionally later point a custom domain `poisepal.com` at Pages. **Not deployed by this work.**

## Brand
- Mark: calm teal rounded square with an upright pillar + breath dot (SVG in `public/favicon.svg`). Intentionally **not** the Closewing indigo wing.
- Accent color: teal (`#2dd4bf` / `#0f766e`), not Closewing indigo.

## Structure
- `index.html` (landing), `privacy.html`, `terms.html` (draft outlines)
- `src/styles.css`, `src/main.ts`
- `public/assets/screenshots/` product UI captures (demo mode)

## Launch TODOs
- Domain: `poisepal.com` canonical URL when purchased (do not buy from this agent).
- Privacy/terms counsel-approved text.
- Pilot form endpoint / Chrome Web Store / signed installers.
