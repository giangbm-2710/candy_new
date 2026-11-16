# Static assets

The site still runs with a static server (`python -m http.server`) and deploys as
plain HTML, CSS, JavaScript and images. Node is only needed when rebuilding CSS.

- After changing HTML classes, JavaScript classes or a theme in `themes.json`, run
  `npm ci` once, then `npm run build:css`. Commit `css/generated` with the changes.
  Each page keeps its original theme, including the dynamically generated menus
  and lightbox styles.
- After adding Material Symbols, run `python scripts/build-icons.py`. It downloads
  a subset using Google's `icon_names` API and saves the CSS, font and license
  locally. Include icon names assigned dynamically in that script's initial set.
  API reference: https://developers.google.com/fonts/docs/material_symbols
- `python scripts/optimize-images.py` regenerates the small logo, Zalo icon and
  menu previews from originals (requires Pillow). Full-size originals are kept.
- `python scripts/cache_bust.py <version>` updates local asset URLs when releasing
  changed assets. Cache policy itself belongs in the hosting server's HTTP headers.

`js/analytics.js` loads Google Analytics only on `tiecluudongcandy.site` and
`www.tiecluudongcandy.site`. Add a new production hostname there if the domain changes.
Text fonts and Font Awesome still use their existing external stylesheets.
