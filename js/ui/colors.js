// Apply pre-designed corporate colors
function applyPresetTheme(themeKey) {
    const theme = THEMES[themeKey];
    if (!theme) return;

    document.getElementById('color-primary').value = theme.primary;
    document.getElementById('color-secondary').value = theme.secondary;
    document.getElementById('color-text-on-dark').value = theme.textLight;
    document.getElementById('color-text-on-light').value = theme.textDark;

    // Sync Hex text inputs
    document.getElementById('color-primary-hex').value = theme.primary;
    document.getElementById('color-secondary-hex').value = theme.secondary;
    document.getElementById('color-text-on-dark-hex').value = theme.textLight;
    document.getElementById('color-text-on-light-hex').value = theme.textDark;

    updateColors();
}

// Sync Hex code updates
function updateHexColor(type, value) {
    if (/^#[0-9A-F]{6}$/i.test(value)) {
        if (type === 'primary') document.getElementById('color-primary').value = value;
        if (type === 'secondary') document.getElementById('color-secondary').value = value;
        if (type === 'text-dark') document.getElementById('color-text-on-dark').value = value;
        if (type === 'text-light') document.getElementById('color-text-on-light').value = value;
        updateColors();
    }
}

// Dynamically update background SVGs and Text blocks with brand colors
function updateColors() {
    const primary = document.getElementById('color-primary').value;
    const secondary = document.getElementById('color-secondary').value;

    // Update SVG background vector nodes
    const poster = document.getElementById('cyber-poster');
    if (poster) poster.style.backgroundColor = primary;
    
    document.getElementById('svg-bg-top-left')?.setAttribute('fill', secondary);
    document.getElementById('svg-bg-mid-right')?.setAttribute('fill', secondary);
    document.getElementById('svg-bg-bottom-right')?.setAttribute('fill', secondary);

    // Sync colors to the inline vector SVG fallback logo
    document.querySelectorAll('.logo-fallback-primary').forEach(el => {
        el.setAttribute('fill', primary);
    });
    document.querySelectorAll('.logo-fallback-accent').forEach(el => {
        el.setAttribute('fill', secondary);
    });
    document.querySelectorAll('.cyber-line').forEach(el => {
        el.setAttribute('stroke', secondary);
    });

    if (typeof renderPosterLayers === 'function') {
        renderPosterLayers();
    }
}
