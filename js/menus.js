/* Native dialog keeps the menu readable at full size and manages keyboard focus. */
document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.querySelector('.menu-viewer');
    if (!viewer) return;
    const image = viewer.querySelector('img');
    const title = viewer.querySelector('h2');
    const stage = viewer.querySelector('.menu-image-stage');
    const zoomLevel = viewer.querySelector('.menu-zoom-level');
    const touchInput = window.matchMedia('(pointer: coarse)');
    const updateHint = () => {
        viewer.querySelector('.menu-zoom-toolbar span').textContent = touchInput.matches
            ? 'Chụm hai ngón để zoom · Kéo một ngón để di chuyển'
            : 'Lăn chuột để zoom · Kéo để di chuyển';
    };
    touchInput.addEventListener('change', updateHint);
    updateHint();
    let scale = 1, panX = 0, panY = 0, fitWidth = 0, fitHeight = 0;
    const pointers = new Map();
    const renderImage = () => {
        const limitX = Math.max(0, (fitWidth * scale - stage.clientWidth) / 2);
        const limitY = Math.max(0, (fitHeight * scale - stage.clientHeight) / 2);
        panX = Math.max(-limitX, Math.min(limitX, panX));
        panY = Math.max(-limitY, Math.min(limitY, panY));
        image.style.transform = `translate(-50%, -50%) translate(${panX}px, ${panY}px) scale(${scale})`;
        zoomLevel.value = `${Math.round(scale * 100)}%`;
        viewer.querySelector('[data-zoom="out"]').disabled = scale <= 1;
        viewer.querySelector('[data-zoom="in"]').disabled = scale >= 5;
    };
    const fitImage = () => {
        if (!viewer.open || !image.naturalWidth) return;
        const fit = Math.min((stage.clientWidth - 16) / image.naturalWidth, (stage.clientHeight - 16) / image.naturalHeight);
        fitWidth = image.naturalWidth * fit;
        fitHeight = image.naturalHeight * fit;
        image.style.width = `${fitWidth}px`;
        image.style.height = `${fitHeight}px`;
        scale = 1; panX = 0; panY = 0;
        renderImage();
    };
    const zoom = (value, x = 0, y = 0) => {
        const nextScale = Math.max(1, Math.min(5, value));
        panX = x - (x - panX) * nextScale / scale;
        panY = y - (y - panY) * nextScale / scale;
        scale = nextScale;
        renderImage();
    };
    const point = event => {
        const rect = stage.getBoundingClientRect();
        return { x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 };
    };
    image.addEventListener('load', fitImage);
    new ResizeObserver(fitImage).observe(stage);
    viewer.querySelector('[data-zoom="in"]').addEventListener('click', () => zoom(scale * 1.3));
    viewer.querySelector('[data-zoom="out"]').addEventListener('click', () => zoom(scale / 1.3));
    viewer.querySelector('[data-zoom="fit"]').addEventListener('click', fitImage);
    stage.addEventListener('wheel', event => {
        event.preventDefault();
        const p = point(event);
        zoom(scale * Math.exp(-event.deltaY * .002), p.x, p.y);
    }, { passive: false });
    stage.addEventListener('pointerdown', event => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        stage.setPointerCapture(event.pointerId);
        pointers.set(event.pointerId, point(event));
        stage.classList.add('is-dragging');
    });
    stage.addEventListener('pointermove', event => {
        if (!pointers.has(event.pointerId)) return;
        const previous = pointers.get(event.pointerId), current = point(event);
        if (pointers.size === 2) {
            const other = [...pointers.entries()].find(([id]) => id !== event.pointerId)[1];
            const oldDistance = Math.hypot(previous.x - other.x, previous.y - other.y);
            const newDistance = Math.hypot(current.x - other.x, current.y - other.y);
            if (oldDistance > 0) zoom(scale * newDistance / oldDistance, (previous.x + other.x) / 2, (previous.y + other.y) / 2);
            panX += (current.x - previous.x) / 2; panY += (current.y - previous.y) / 2;
        } else {
            panX += current.x - previous.x; panY += current.y - previous.y;
        }
        pointers.set(event.pointerId, current);
        renderImage();
    });
    const releasePointer = event => {
        pointers.delete(event.pointerId);
        if (!pointers.size) stage.classList.remove('is-dragging');
    };
    stage.addEventListener('pointerup', releasePointer);
    stage.addEventListener('pointercancel', releasePointer);
    stage.addEventListener('lostpointercapture', releasePointer);
    stage.addEventListener('keydown', event => {
        if (!['+', '=', '-', '0', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === '+' || event.key === '=') zoom(scale * 1.3);
        else if (event.key === '-') zoom(scale / 1.3);
        else if (event.key === '0') fitImage();
        else {
            if (event.key === 'ArrowLeft') panX += 40;
            if (event.key === 'ArrowRight') panX -= 40;
            if (event.key === 'ArrowUp') panY += 40;
            if (event.key === 'ArrowDown') panY -= 40;
            renderImage();
        }
    });
    document.querySelectorAll('[data-menu-image]').forEach(button => {
        button.addEventListener('click', () => {
            image.src = button.dataset.menuImage;
            image.alt = button.dataset.menuTitle;
            title.textContent = button.dataset.menuTitle;
            viewer.showModal();
            fitImage();
            document.body.classList.add('menu-viewer-open');
        });
    });
    viewer.querySelector('.menu-viewer-close').addEventListener('click', () => viewer.close());
    viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
    viewer.addEventListener('close', () => {
        document.body.classList.remove('menu-viewer-open');
        pointers.clear();
        stage.classList.remove('is-dragging');
    });
    const track = document.querySelector('.menu-track');
    if (!track) return;
    const previous = document.querySelector('.menu-arrow-prev');
    const next = document.querySelector('.menu-arrow-next');
    const dots = document.querySelector('.menu-dots');
    const status = document.querySelector('.menu-result');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let positions = [];
    const visibleCards = () => [...track.querySelectorAll('.menu-card:not([hidden])')];
    const scrollToPosition = left => track.scrollTo({ left, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    const updateControls = () => {
        const max = Math.max(0, track.scrollWidth - track.clientWidth);
        previous.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max - 2;
        let closest = 0;
        positions.forEach((position, index) => {
            if (Math.abs(position - track.scrollLeft) < Math.abs(positions[closest] - track.scrollLeft)) closest = index;
        });
        [...dots.children].forEach((dot, index) => dot.setAttribute('aria-current', String(index === closest)));
    };
    const rebuildControls = () => {
        const cards = visibleCards();
        const max = Math.max(0, track.scrollWidth - track.clientWidth);
        const first = cards[0];
        positions = first ? [...new Set(cards.map(card => Math.round(Math.min(max, card.offsetLeft - first.offsetLeft))))] : [0];
        const focusedDot = dots.contains(document.activeElement);
        dots.replaceChildren(...positions.map((position, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('aria-label', `Chuyển đến vị trí ${index + 1} trên ${positions.length}`);
            button.setAttribute('aria-controls', track.id);
            button.addEventListener('click', () => scrollToPosition(position));
            return button;
        }));
        if (focusedDot) track.focus({ preventScroll: true });
        updateControls();
    };
    const move = direction => {
        const target = direction > 0
            ? positions.find(position => position > track.scrollLeft + 3)
            : [...positions].reverse().find(position => position < track.scrollLeft - 3);
        if (target !== undefined) scrollToPosition(target);
    };
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', updateControls, { passive: true });
    track.addEventListener('keydown', event => {
        if (event.target !== track) return;
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) event.preventDefault();
        if (event.key === 'ArrowLeft') move(-1);
        if (event.key === 'ArrowRight') move(1);
        if (event.key === 'Home') scrollToPosition(0);
        if (event.key === 'End') scrollToPosition(track.scrollWidth);
    });
    document.querySelectorAll('[data-menu-filter]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-menu-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
            track.querySelectorAll('[data-menu-kind]').forEach(card => {
                card.hidden = button.dataset.menuFilter !== 'all' && button.dataset.menuFilter !== card.dataset.menuKind;
            });
            track.scrollTo({ left: 0, behavior: 'instant' });
            status.textContent = `${visibleCards().length} gói tính theo khách`;
            rebuildControls();
        });
    });
    new ResizeObserver(rebuildControls).observe(track);
    rebuildControls();
});
