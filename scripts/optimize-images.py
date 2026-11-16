"""Build small UI assets and menu previews; keep original files for future edits.

Requires Pillow: python -m pip install Pillow
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]


def export(source, destination, width, quality):
    with Image.open(ROOT / source) as original:
        image = ImageOps.exif_transpose(original).convert('RGBA')
        if image.width > width:
            image = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
        image.save(ROOT / destination, 'WEBP', quality=quality, method=6)
    print(f'{destination}: {(ROOT / destination).stat().st_size} bytes')


if __name__ == '__main__':
    export('imgs/logo.png', 'imgs/logo-small.webp', 240, 85)
    export('imgs/zalo.png', 'imgs/zalo-small.webp', 96, 85)
    for filename in ['50.png', '60.jpg', '65.png', '75.jpg', '100.jpg', '120.jpg', '2m.jpg', '2m7.png']:
        source = f'imgs/menus/{filename}'
        stem = Path(filename).stem
        export(source, f'imgs/menus/{stem}.webp', 1052, 85)
        export(source, f'imgs/menus/{stem}-640.webp', 640, 80)
