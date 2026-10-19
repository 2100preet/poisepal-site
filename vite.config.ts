import { defineConfig, type Plugin } from 'vite';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Keep internal notes out of the published build: strip HTML comments from built pages
// and '#' comment lines from robots.txt. Source files keep their comments.
function stripInternalComments(): Plugin {
  return {
    name: 'strip-internal-comments',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (html) => html.replace(/<!--[\s\S]*?-->/g, '').replace(/^[ \t]*\n/gm, ''),
    },
    closeBundle() {
      const robots = resolve(__dirname, 'dist/robots.txt');
      if (existsSync(robots)) {
        const out = readFileSync(robots, 'utf8').split('\n').filter((l) => !l.trim().startsWith('#')).join('\n');
        writeFileSync(robots, out);
      }
    },
  };
}

export default defineConfig({
  plugins: [stripInternalComments()],
  esbuild: { legalComments: 'none' },
  // GitHub Pages project site: https://<user>.github.io/poisepal-site/
  base: '/poisepal-site/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
      },
    },
  },
});
