let currentBackgroundStyle = 'curves';
let currentLogoPosition = 'top-right';
let currentCyberOverlay = 'none';

// UI Tab Management
function switchTab(tabId) {
    // Hide all panels
    document.getElementById('panel-content').classList.add('hidden');
    document.getElementById('panel-design').classList.add('hidden');
    document.getElementById('panel-images').classList.add('hidden');

    // Remove active button styles
    document.getElementById('tab-content').className = "flex-1 py-3 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition";
    document.getElementById('tab-design').className = "flex-1 py-3 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition";
    document.getElementById('tab-images').className = "flex-1 py-3 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition";

    // Show current
    document.getElementById(`panel-${tabId}`).classList.remove('hidden');
    document.getElementById(`tab-${tabId}`).className = "flex-1 py-3 text-sm font-semibold border-b-2 border-emerald-500 text-emerald-400 transition";
}

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
    const textDark = document.getElementById('color-text-on-light').value;
    const textLight = document.getElementById('color-text-on-dark').value;

    // Update SVG background vector nodes
    document.getElementById('cyber-poster').style.backgroundColor = primary;
    document.getElementById('svg-bg-top-left').setAttribute('fill', secondary);
    document.getElementById('svg-bg-mid-right').setAttribute('fill', secondary);
    document.getElementById('svg-bg-bottom-right').setAttribute('fill', secondary);

    // Update Typography Colors
    document.getElementById('poster-callout-left').style.color = textDark;
    document.getElementById('poster-callout-right').style.color = textLight;
    document.getElementById('poster-title-1').style.color = textLight;
    document.getElementById('poster-title-2').style.color = textLight;
    document.getElementById('poster-date').style.color = textLight;
    document.getElementById('poster-time').style.color = textLight;
    document.getElementById('poster-location').style.color = textLight;
    document.getElementById('poster-speaker-name').style.color = textLight;
    document.getElementById('poster-speaker-role').style.color = textLight;

    // Update border colors dynamically on the speaker circle frame
    const avatarCircle = document.getElementById('poster-speaker-img').closest('.rounded-full');
    if (avatarCircle) {
        avatarCircle.style.borderColor = primary;
        avatarCircle.style.backgroundColor = primary;
    }

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
}

// Handle image error / loading failures elegantly
function handleLogoError(img) {
    img.style.display = 'none';
    document.getElementById('poster-logo-svg-fallback').classList.remove('hidden');
}

// Dynamic Text Updates
function updatePoster() {
    document.getElementById('poster-callout-left').innerText = document.getElementById('input-callout-left').value;
    document.getElementById('poster-callout-right').innerText = document.getElementById('input-callout-right').value;
    document.getElementById('poster-title-1').innerText = document.getElementById('input-title-1').value;
    document.getElementById('poster-title-2').innerText = document.getElementById('input-title-2').value;
    document.getElementById('poster-date').innerText = document.getElementById('input-date').value;
    document.getElementById('poster-time').innerText = document.getElementById('input-time').value;
    document.getElementById('poster-location').innerText = document.getElementById('input-location').value;
    document.getElementById('poster-speaker-name').innerText = document.getElementById('input-speaker-name').value;
    document.getElementById('poster-speaker-role').innerText = document.getElementById('input-speaker-role').value;
}

// Update font sizes and alignment to prevent clipping
function updateLayoutSizes() {
    const fzTitle = document.getElementById('slider-fz-title').value;
    const fzCallouts = document.getElementById('slider-fz-callouts').value;
    const fzDetails = document.getElementById('slider-fz-details').value;
    const fzSpeaker = document.getElementById('slider-fz-speaker').value;
    const verticalShift = document.getElementById('slider-vertical-shift').value;

    // Update labels
    document.getElementById('lbl-fz-title').innerText = fzTitle + 'px';
    document.getElementById('lbl-fz-callouts').innerText = fzCallouts + 'px';
    document.getElementById('lbl-fz-details').innerText = fzDetails + 'px';
    document.getElementById('lbl-fz-speaker').innerText = fzSpeaker + 'px';
    document.getElementById('lbl-vertical-shift').innerText = verticalShift + 'px';

    // Apply to poster elements
    document.getElementById('poster-title-1').style.fontSize = fzTitle + 'px';
    document.getElementById('poster-title-2').style.fontSize = (fzTitle - 2) + 'px'; // keeps hierarchy proportional

    document.getElementById('poster-callout-left').style.fontSize = fzCallouts + 'px';
    document.getElementById('poster-callout-right').style.fontSize = fzCallouts + 'px';

    document.getElementById('poster-date').style.fontSize = fzDetails + 'px';
    document.getElementById('poster-time').style.fontSize = fzDetails + 'px';
    document.getElementById('poster-location').style.fontSize = (fzDetails - 2) + 'px';

    document.getElementById('poster-speaker-name').style.fontSize = fzSpeaker + 'px';

    // Apply Vertical Shift to Middle Section
    document.getElementById('poster-mid-section').style.marginTop = verticalShift + 'px';
}

// Font family switcher
function updateFont(fontClass) {
    const title1 = document.getElementById('poster-title-1');
    const title2 = document.getElementById('poster-title-2');
    const name = document.getElementById('poster-speaker-name');

    // Reset
    title1.className = title1.className.replace(/poster-font-\w+/g, '');
    title2.className = title2.className.replace(/poster-font-\w+/g, '');
    name.className = name.className.replace(/poster-font-\w+/g, '');

    let appliedClass = 'poster-font-title';
    if (fontClass === 'font-varela') appliedClass = 'poster-font-sub';
    if (fontClass === 'font-rubik') appliedClass = ''; // standard rubik

    title1.classList.add(appliedClass);
    title2.classList.add(appliedClass);
    name.classList.add(appliedClass);
}

function setLogoPosition(pos) {
    currentLogoPosition = pos;
    const logoCont = document.getElementById('poster-logo-container');
    const leftCalloutContainer = document.getElementById('container-callout-left');
    const rightCalloutContainer = document.getElementById('container-callout-right');
    const headerSection = document.getElementById('poster-header-section');

    // Highlight active control button
    document.getElementById('btn-logo-top-left').className = "py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white";
    document.getElementById('btn-logo-top-right').className = "py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white";
    document.getElementById('btn-logo-bottom-left').className = "py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white";

    document.getElementById(`btn-logo-${pos}`).className = "py-2 bg-slate-900 border border-emerald-500 rounded text-xs text-white";

    // Reset custom layout spacing modifications to avoid overlapping
    leftCalloutContainer.style.paddingLeft = '0px';
    rightCalloutContainer.style.paddingRight = '0px';
    leftCalloutContainer.style.marginLeft = '0px';
    rightCalloutContainer.style.marginRight = '0px';
    headerSection.style.paddingTop = '8px';

    // Reposition absolute container inside poster
    logoCont.className = "absolute transition-all duration-200 z-30";

    // Get dynamic offset based on current logo size + background padding + generous safety margin (24px)
    const logoSize = parseInt(document.getElementById('logo-size').value) || 95;
    const logoBgEl = document.getElementById('toggle-logo-bg');
    const extraPadding = (logoBgEl && logoBgEl.checked) ? 16 : 0;
    const dynamicOffset = (logoSize + extraPadding + 24) + 'px';

    if (pos === 'top-left') {
        logoCont.style.top = '32px';
        logoCont.style.left = '32px';
        logoCont.style.bottom = 'auto';
        logoCont.style.right = 'auto';

        // Shift the left callout physically to the right to completely avoid overlapping
        leftCalloutContainer.style.marginLeft = dynamicOffset;
        headerSection.style.paddingTop = '24px';
    } else if (pos === 'top-right') {
        logoCont.style.top = '32px';
        logoCont.style.right = '32px';
        logoCont.style.bottom = 'auto';
        logoCont.style.left = 'auto';

        // Shift the right callout physically to the left to safely avoid overlapping
        rightCalloutContainer.style.marginRight = dynamicOffset;
        headerSection.style.paddingTop = '24px';
    } else if (pos === 'bottom-left') {
        logoCont.style.bottom = '32px';
        logoCont.style.left = '32px';
        logoCont.style.top = 'auto';
        logoCont.style.right = 'auto';
    }
}

// Dynamic Scaling for Brand Logo
function updateLogoScale(size) {
    document.getElementById('logo-size-lbl').innerText = size + 'px';
    document.getElementById('poster-logo').style.width = size + 'px';
    document.getElementById('poster-logo-svg-fallback').style.width = size + 'px';
    document.getElementById('poster-logo-svg-fallback').style.height = size + 'px';

    // Re-apply padding layout adjustments dynamically based on the new size
    setLogoPosition(currentLogoPosition);
}

// Logo Visibility Toggle
function updateLogoVisibility() {
    const visible = document.getElementById('toggle-logo').checked;
    document.getElementById('poster-logo-container').style.display = visible ? 'block' : 'none';
}

// Apply Background squigglies dynamic paths
function applyBackgroundStyle(styleName) {
    currentBackgroundStyle = styleName;
    const style = BACKGROUND_STYLES[styleName];
    if (!style) return;

    // Update UI active button styles
    document.querySelectorAll('.bg-style-btn').forEach(btn => {
        btn.classList.remove('border-emerald-500');
        btn.classList.add('border-slate-700');
    });
    const activeBtn = document.getElementById(`btn-bg-style-${styleName}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-slate-700');
        activeBtn.classList.add('border-emerald-500');
    }

    // Apply SVG paths
    document.getElementById('svg-bg-top-left').setAttribute('d', style.topLeftD);
    document.getElementById('svg-bg-mid-right').setAttribute('d', style.midRightD);
    document.getElementById('svg-bg-bottom-right').setAttribute('d', style.bottomRightD);
}

// Apply dynamic cybersecurity thematic background overlays
function applyCyberOverlay(overlayName) {
    currentCyberOverlay = overlayName;
    
    // Hide all cyber overlay groups
    const overlays = ['networks', 'electronics', 'reversing', 'exploitation'];
    overlays.forEach(id => {
        const el = document.getElementById(`svg-cyber-${id}`);
        if (el) el.classList.add('hidden');
    });

    // Show active overlay group
    if (overlayName === 'exploit' || overlayName === 'exploitation') {
        const el = document.getElementById('svg-cyber-exploitation');
        if (el) el.classList.remove('hidden');
    } else if (overlayName !== 'none') {
        const el = document.getElementById(`svg-cyber-${overlayName}`);
        if (el) el.classList.remove('hidden');
    }
}

// Logo Background Toggle
function updateLogoBackground() {
    const hasBg = document.getElementById('toggle-logo-bg').checked;
    const logoCont = document.getElementById('poster-logo-container');
    if (hasBg) {
        logoCont.style.backgroundColor = '#ffffff';
        logoCont.style.padding = '8px';
        logoCont.style.borderRadius = '12px';
        logoCont.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    } else {
        logoCont.style.backgroundColor = 'transparent';
        logoCont.style.padding = '0px';
        logoCont.style.borderRadius = '0px';
        logoCont.style.boxShadow = 'none';
    }
    
    // Re-apply positioning to dynamically adjust margin padding for dynamicOffset!
    setLogoPosition(currentLogoPosition);
}

// Handle Custom Logo Upload
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById('poster-logo');
            img.src = e.target.result;
            img.style.display = 'block';
            document.getElementById('poster-logo-svg-fallback').classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// Recenter / Crop values for Speaker Photo Frame
function updateAvatarAdjustment() {
    const zoom = document.getElementById('avatar-zoom').value;
    const x = document.getElementById('avatar-x').value;
    const y = document.getElementById('avatar-y').value;

    document.getElementById('zoom-lbl').innerText = zoom + '%';
    document.getElementById('x-lbl').innerText = x + 'px';
    document.getElementById('y-lbl').innerText = y + 'px';

    const img = document.getElementById('poster-speaker-img');
    img.style.width = zoom + '%';
    img.style.left = x + 'px';
    img.style.top = y + 'px';
}

// Handle Speaker Custom Portrait Image Upload
function handleSpeakerUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById('poster-speaker-img');
            img.src = e.target.result;
            // Reset cropping adjustments so uploading user gets a standard view
            document.getElementById('avatar-zoom').value = 100;
            document.getElementById('avatar-x').value = 0;
            document.getElementById('avatar-y').value = 0;
            updateAvatarAdjustment();
        };
        reader.readAsDataURL(file);
    }
}

// Restore original image with the predefined Yair face crop settings
function restoreOriginalSpeakerPreset() {
    const img = document.getElementById('poster-speaker-img');
    img.src = DEFAULTS.speakerImgSrc;
    document.getElementById('avatar-zoom').value = DEFAULTS.avatarZoom;
    document.getElementById('avatar-x').value = DEFAULTS.avatarX;
    document.getElementById('avatar-y').value = DEFAULTS.avatarY;
    updateAvatarAdjustment();
}

// Reset whole app to standard defaults
function resetToDefaults() {
    // Reset visibility of images
    document.getElementById('poster-logo').style.display = 'block';
    document.getElementById('poster-logo-svg-fallback').classList.add('hidden');

    // Text values
    document.getElementById('input-callout-left').value = DEFAULTS.calloutLeft;
    document.getElementById('input-callout-right').value = DEFAULTS.calloutRight;
    document.getElementById('input-title-1').value = DEFAULTS.title1;
    document.getElementById('input-title-2').value = DEFAULTS.title2;
    document.getElementById('input-date').value = DEFAULTS.date;
    document.getElementById('input-time').value = DEFAULTS.time;
    document.getElementById('input-location').value = DEFAULTS.location;
    document.getElementById('input-speaker-name').value = DEFAULTS.speakerName;
    document.getElementById('input-speaker-role').value = DEFAULTS.speakerRole;

    // Font Sizes Sliders
    document.getElementById('slider-fz-title').value = DEFAULTS.fzTitle;
    document.getElementById('slider-fz-callouts').value = DEFAULTS.fzCallouts;
    document.getElementById('slider-fz-details').value = DEFAULTS.fzDetails;
    document.getElementById('slider-fz-speaker').value = DEFAULTS.fzSpeaker;
    document.getElementById('slider-vertical-shift').value = DEFAULTS.verticalShift;

    // Visual elements
    document.getElementById('toggle-logo').checked = DEFAULTS.logoVisible;
    document.getElementById('toggle-logo-bg').checked = DEFAULTS.logoBg;
    document.getElementById('logo-size').value = DEFAULTS.logoSize;
    document.getElementById('poster-logo').src = DEFAULTS.logoImgSrc;

    // Color theme
    applyPresetTheme(DEFAULTS.theme);

    // Background style
    applyBackgroundStyle(DEFAULTS.bgStyle);

    // Cyber Overlay style
    if (document.getElementById('select-cyber-overlay')) {
        document.getElementById('select-cyber-overlay').value = DEFAULTS.cyberOverlay;
        applyCyberOverlay(DEFAULTS.cyberOverlay);
    }

    // Positioning
    setLogoPosition(DEFAULTS.logoPosition);
    updateLogoScale(DEFAULTS.logoSize);
    updateLogoVisibility();
    updateLogoBackground();

    // Speaker original preset
    restoreOriginalSpeakerPreset();
    updatePoster();
    updateLayoutSizes();
}

// Export poster to PNG File
function downloadPNG() {
    const poster = document.getElementById('cyber-poster');

    // Show processing alert message box rather than alert()
    const msgBox = document.createElement('div');
    msgBox.className = "fixed inset-0 bg-black/75 z-50 flex items-center justify-center text-white text-lg font-semibold dir-rtl no-print";
    msgBox.innerHTML = `
        <div class="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-4 max-w-sm text-center">
            <svg class="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span>מייצר קובץ תמונה באיכות גבוהה... נא להמתין</span>
        </div>
    `;
    document.body.appendChild(msgBox);

    // Use html2canvas to capture vector details correctly
    html2canvas(poster, {
        scale: 2.5, // Enhances print DPI density
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Cyber_Poster_${document.getElementById('input-speaker-name').value.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        msgBox.remove();
    }).catch(err => {
        msgBox.remove();
        console.error("PNG export error:", err);
    });
}

// Printer & Native PDF Exporter
function printPoster() {
    window.print();
}

// Kick off on load
window.onload = function () {
    resetToDefaults();
}
