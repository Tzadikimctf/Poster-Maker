// Mobile scaling and viewport adjustment to fit A4 layout on phone widths
function adjustPosterScale() {
    const poster = document.getElementById('cyber-poster');
    const scaleWrapper = document.getElementById('poster-scale-wrapper');
    if (!poster || !scaleWrapper) return;

    const mainElement = scaleWrapper.parentElement;
    const parentWidth = mainElement.clientWidth;
    const parentHeight = mainElement.clientHeight;

    // Scale to fit both dimensions with some breathing padding (16px)
    const scaleX = (parentWidth - 16) / 595;
    const scaleY = (parentHeight - 16) / 842;
    let scale = Math.min(scaleX, scaleY);

    if (scale > 1.05) scale = 1.05; // Cap upscale
    if (scale < 0.15) scale = 0.15; // Floor downscale

    scaleWrapper.style.transform = `scale(${scale})`;
    scaleWrapper.style.transformOrigin = 'center center';

    // Fix bounds to prevent parent container layout collapses
    scaleWrapper.style.width = '595px';
    scaleWrapper.style.height = '842px';
}

// Listeners and kick off triggers
window.addEventListener('resize', adjustPosterScale);

window.onload = function () {
    resetToDefaults();
    populatePresetDropdown();
    adjustPosterScale();
    checkPersistedDirectory();
    initDraggableEngine();
}
