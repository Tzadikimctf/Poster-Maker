// Logo and Speaker Portrait Model Mapping Functions

function setLogoPosition(pos) {
    currentLogoPosition = pos;

    // Highlight active control button
    const btnTl = document.getElementById('btn-logo-top-left');
    const btnTr = document.getElementById('btn-logo-top-right');
    const btnBl = document.getElementById('btn-logo-bottom-left');

    if (btnTl) btnTl.className = "py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white";
    if (btnTr) btnTr.className = "py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white";
    if (btnBl) btnBl.className = "py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white";

    const activeBtn = document.getElementById(`btn-logo-${pos}`);
    if (activeBtn) activeBtn.className = "py-2 bg-slate-900 border border-emerald-500 rounded text-xs text-white";

    // Read size from slider to trigger auto layout updates in renderPosterLayers()
    const logoLayer = layers.find(l => l.id === 'layer_logo_1');
    if (logoLayer) {
        // Update position coordinates state
        if (pos === 'top-left') {
            logoLayer.position = { left: 32, top: 32 };
        } else if (pos === 'top-right') {
            logoLayer.position = { left: 595 - 32 - logoLayer.size.width, top: 32 };
        } else if (pos === 'bottom-left') {
            logoLayer.position = { left: 32, top: 842 - 32 - logoLayer.size.height };
        }
    }

    if (typeof renderPosterLayers === 'function') {
        renderPosterLayers();
    }
}

// Dynamic Scaling for Brand Logo
function updateLogoScale(size) {
    const lbl = document.getElementById('logo-size-lbl');
    if (lbl) lbl.innerText = size + 'px';

    const logoLayer = layers.find(l => l.id === 'layer_logo_1');
    if (logoLayer) {
        logoLayer.size.width = parseInt(size);
        logoLayer.size.height = parseInt(size);
        // Trigger position updates
        setLogoPosition(currentLogoPosition);
    }
}

// Logo Visibility Toggle
function updateLogoVisibility() {
    const toggle = document.getElementById('toggle-logo');
    if (!toggle) return;

    const logoLayer = layers.find(l => l.id === 'layer_logo_1');
    if (logoLayer) {
        logoLayer.visible = toggle.checked;
        if (typeof renderPosterLayers === 'function') {
            renderPosterLayers();
        }
    }
}

// Logo Shadow Type Selector
function setLogoShadowType(type) {
    currentLogoShadowType = type;

    // Highlight active control button
    const btnGlow = document.getElementById('btn-shadow-type-glow');
    const btnOutline = document.getElementById('btn-shadow-type-outline');
    
    if (btnGlow && btnOutline) {
        if (type === 'glow') {
            btnGlow.className = "px-2.5 py-1 text-[10px] font-semibold bg-emerald-950/45 border border-emerald-500/30 text-emerald-400 rounded-md transition animate-none";
            btnOutline.className = "px-2.5 py-1 text-[10px] font-semibold text-slate-400 hover:text-slate-200 rounded-md transition";
        } else {
            btnOutline.className = "px-2.5 py-1 text-[10px] font-semibold bg-emerald-950/45 border border-emerald-500/30 text-emerald-400 rounded-md transition animate-none";
            btnGlow.className = "px-2.5 py-1 text-[10px] font-semibold text-slate-400 hover:text-slate-200 rounded-md transition";
        }
    }

    updateLogoBackground();
}

// Logo Background & Shadow Toggle
function updateLogoBackground() {
    const logoLayer = layers.find(l => l.id === 'layer_logo_1');
    if (!logoLayer) return;

    const hasBg = document.getElementById('toggle-logo-bg')?.checked;
    const bgColor = document.getElementById('color-logo-bg')?.value || '#ffffff';
    const hasShadow = document.getElementById('toggle-logo-shadow')?.checked;
    const shadowColor = document.getElementById('color-logo-shadow')?.value || '#000000';

    logoLayer.hasBg = !!hasBg;
    logoLayer.bgColorHex = bgColor;
    logoLayer.hasShadow = !!hasShadow;
    logoLayer.shadowColorHex = shadowColor;
    logoLayer.shadowType = currentLogoShadowType;

    if (typeof renderPosterLayers === 'function') {
        renderPosterLayers();
    }
}

// Handle Custom Logo Upload
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const logoLayer = layers.find(l => l.id === 'layer_logo_1');
            if (logoLayer) {
                logoLayer.src = e.target.result;
                if (typeof renderPosterLayers === 'function') {
                    renderPosterLayers();
                }
            }
        };
        reader.readAsDataURL(file);
    }
}

// Recenter / Crop values for Speaker Portrait Image
function updateAvatarAdjustment() {
    const zoom = parseInt(document.getElementById('avatar-zoom')?.value || 100);
    const x = parseInt(document.getElementById('avatar-x')?.value || 0);
    const y = parseInt(document.getElementById('avatar-y')?.value || 0);

    const zoomLbl = document.getElementById('zoom-lbl');
    const xLbl = document.getElementById('x-lbl');
    const yLbl = document.getElementById('y-lbl');

    if (zoomLbl) zoomLbl.innerText = zoom + '%';
    if (xLbl) xLbl.innerText = x + 'px';
    if (yLbl) yLbl.innerText = y + 'px';

    const speakerLayer = layers.find(l => l.id === 'layer_speaker_portrait');
    if (speakerLayer) {
        speakerLayer.crop = { x: x, y: y, zoom: zoom };
        if (typeof renderPosterLayers === 'function') {
            renderPosterLayers();
        }
    }
}

// Handle Speaker Custom Portrait Image Upload
function handleSpeakerUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const speakerLayer = layers.find(l => l.id === 'layer_speaker_portrait');
            if (speakerLayer) {
                speakerLayer.src = e.target.result;
                
                // Reset cropping controls in DOM
                const zoomEl = document.getElementById('avatar-zoom');
                const xEl = document.getElementById('avatar-x');
                const yEl = document.getElementById('avatar-y');

                if (zoomEl) zoomEl.value = 100;
                if (xEl) xEl.value = 0;
                if (yEl) yEl.value = 0;

                speakerLayer.crop = { x: 0, y: 0, zoom: 100 };
                updateAvatarAdjustment();
            }
        };
        reader.readAsDataURL(file);
    }
}

// Restore original speaker image and zoom crop settings
function restoreOriginalSpeakerPreset() {
    const speakerLayer = layers.find(l => l.id === 'layer_speaker_portrait');
    if (speakerLayer) {
        speakerLayer.src = DEFAULTS.speakerImgSrc;
        speakerLayer.crop = { x: DEFAULTS.avatarX, y: DEFAULTS.avatarY, zoom: DEFAULTS.avatarZoom };

        const zoomEl = document.getElementById('avatar-zoom');
        const xEl = document.getElementById('avatar-x');
        const yEl = document.getElementById('avatar-y');

        if (zoomEl) zoomEl.value = DEFAULTS.avatarZoom;
        if (xEl) xEl.value = DEFAULTS.avatarX;
        if (yEl) yEl.value = DEFAULTS.avatarY;

        updateAvatarAdjustment();
    }
}

function handleLogoError(img) {
    // Empty - error handling delegates to dynamic layers engine
}
