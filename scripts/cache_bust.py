"""
Cache-busting script for Candy Catering static site.
Appends or updates ?v=<version> on local CSS, JS, and menu images across all HTML files.
Removes legacy no-cache meta tags; versioned assets can use normal browser caching.
"""
import os
import re
import sys
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

VERSION = sys.argv[1] if len(sys.argv) > 1 else datetime.now().strftime('%Y%m%d%H%M')

# Match local CSS and JS files
RE_ASSETS = re.compile(
    r'((?:href|src)=["\'](?:\.\./)*'
    r'(?:css/[a-zA-Z0-9_/\-]+\.css|js/[a-zA-Z0-9_\-]+\.js))'
    r'(?:\?v=[^"\']*)?(["\'])'
)

# Match local menu images in pricing page
RE_MENU_IMGS = re.compile(
    r'((?:data-menu-image|src)=["\'](?:\.\./)*'
    r'imgs/menus/[a-zA-Z0-9_\-]+\.(?:png|jpg|jpeg|webp))'
    r'(?:\?v=[^"\']*)?(["\'])'
)

RE_NO_CACHE = re.compile(
    r'[ \t]*<meta http-equiv="(?:Cache-Control|Pragma|Expires)"[^>]*>\n?', re.I
)

def update_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Update CSS & JS version
    content = RE_ASSETS.sub(r'\1?v=' + VERSION + r'\2', content)

    # 2. Update menu images version
    content = RE_MENU_IMGS.sub(r'\1?v=' + VERSION + r'\2', content)

    # 3. Remove legacy no-cache tags; changed asset URLs already bust the cache.
    content = RE_NO_CACHE.sub('', content)

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        rel_path = os.path.relpath(file_path, ROOT_DIR)
        print(f'[UPDATED] {rel_path}')
        return True
    return False

def main():
    print(f'Starting cache-busting with version: {VERSION}')
    updated_count = 0
    total_count = 0

    for root, dirs, files in os.walk(ROOT_DIR):
        # Skip .git, node_modules, mock
        dirs[:] = [d for d in dirs if d not in ('.git', 'node_modules', 'mock', '.agents')]
        for file in files:
            if file.endswith('.html'):
                total_count += 1
                fp = os.path.join(root, file)
                if update_html_file(fp):
                    updated_count += 1

    print(f'Finished: {updated_count}/{total_count} HTML files updated.')

if __name__ == '__main__':
    main()
