"""Download only the Material Symbols used by HTML and JavaScript.

API: https://developers.google.com/fonts/docs/material_symbols
Run again when adding icons. The generated CSS/font are served locally.
"""
from pathlib import Path
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
USER_AGENT = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
              'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36')


def download(url):
    request = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


if __name__ == '__main__':
    names = {'expand_less'}  # Assigned dynamically when expanding event details.
    files = [p for p in ROOT.rglob('*.html') if 'node_modules' not in p.parts]
    files += list((ROOT / 'js').glob('*.js'))
    for path in files:
        names.update(re.findall(
            r'<span\b[^>]*class="[^"]*material-symbols-outlined[^>]*>\s*([a-z0-9_]+)\s*</span>',
            path.read_text(encoding='utf-8'),
        ))
    url = ('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1'
           '&display=block&icon_names=' + ','.join(sorted(names)))
    css = download(url).decode('utf-8')
    assert css.count('@font-face') == 1 and "format('woff2')" in css, 'Expected a single variable WOFF2 font'
    font_url = re.search(r'url\((https://[^)]+)\)', css)[1]
    font = download(font_url)
    folder = ROOT / 'fonts'
    folder.mkdir(exist_ok=True)
    (folder / 'material-symbols.woff2').write_bytes(font)
    css = css.replace(font_url, '../fonts/material-symbols.woff2')
    (ROOT / 'css/icons.css').write_text(css, encoding='utf-8')
    license_url = 'https://raw.githubusercontent.com/google/material-design-icons/master/LICENSE'
    (folder / 'Material-Symbols-LICENSE.txt').write_bytes(download(license_url))
    print(f'{len(names)} icons: {len(font)} bytes')
