// Keep page-specific themes while compiling all HTML and dynamically injected UI.
const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const cssnano = require('cssnano');
const { themes, routes } = require('./themes.json');

async function build() {
  const root = path.resolve(__dirname, '..');
  process.chdir(root);
  fs.mkdirSync('css/generated', { recursive: true });
  for (const [name, theme] of Object.entries(themes)) {
    const content = Object.entries(routes)
      .filter(([, value]) => value === name)
      .map(([file]) => file);
    const result = await postcss([
      tailwind({
        ...theme,
        content: [...content, './js/*.js'],
        plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
      }),
      cssnano({ preset: 'default' }),
    ]).process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
    fs.writeFileSync(`css/generated/${name}.css`, result.css + '\n');
    console.log(`${name}: ${Buffer.byteLength(result.css)} bytes`);
  }
}

build().catch(error => { console.error(error); process.exitCode = 1; });
