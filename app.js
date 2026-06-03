let currentBackgroundStyle = 'curves';
let currentLogoPosition = 'top-right';
let currentCyberOverlay = 'none';
let currentLanguage = 'en';
let customPresets = {};

// Built-in presets stored directly in script to bypass offline CORS file blocks
const BUILT_IN_PRESETS = {
    "tzadik-he": {
        calloutLeft: 'או סתם ללמוד איך האקרים חושבים ופועלים',
        calloutRight: 'בואו לרכוש ידע שיכול להיות רלוונטי לקריירה שלכם!',
        title1: 'מבוא לסייבר:',
        title2: 'וירוסים ועד קריירות',
        date: 'יום חמישי, 25.12.2025',
        time: '14:00-15:00',
        location: 'בניין 503 (מדע״ח) חדר 226',
        speakerName: 'שם המרצה',
        speakerRole: 'תפקיד המרצה / חברה',
        theme: 'tzadik',
        bgStyle: 'curves',
        cyberOverlay: 'none',
        logoVisible: true,
        logoBg: false,
        logoPosition: 'top-right',
        logoSize: 95,
        avatarZoom: 440,
        avatarX: -154,
        avatarY: -386,
        fzTitle: 36,
        fzCallouts: 15,
        fzDetails: 19,
        fzSpeaker: 22,
        verticalShift: 0,
        primaryColor: '#004124',
        secondaryColor: '#71CCE7',
        textDarkColor: '#0f2219',
        textLightColor: '#000000',
        layoutDirection: 'rtl',
        uiLanguage: 'he',
        speakerImgSrc: 'https://placehold.co/300x300/004124/71CCE7?text=Speaker',
        logoImgSrc: 'Biu_tzadik_nobackground.png'
    },
    "tzadik-en": {
        calloutLeft: 'Or just learn how hackers think and operate',
        calloutRight: 'Come acquire knowledge that could be relevant to your career!',
        title1: 'Introduction to Cyber:',
        title2: 'From Viruses to Careers',
        date: 'Thursday, 25.12.2025',
        time: '14:00-15:00',
        location: 'Building 503 (CS) Room 226',
        speakerName: 'Speaker Name',
        speakerRole: "Speaker's Role / Company",
        theme: 'tzadik',
        bgStyle: 'curves',
        cyberOverlay: 'none',
        logoVisible: true,
        logoBg: false,
        logoPosition: 'top-left',
        logoSize: 95,
        avatarZoom: 440,
        avatarX: -154,
        avatarY: -386,
        fzTitle: 36,
        fzCallouts: 15,
        fzDetails: 19,
        fzSpeaker: 22,
        verticalShift: 0,
        primaryColor: '#004124',
        secondaryColor: '#71CCE7',
        textDarkColor: '#0f2219',
        textLightColor: '#000000',
        layoutDirection: 'ltr',
        uiLanguage: 'en',
        speakerImgSrc: 'https://placehold.co/300x300/004124/71CCE7?text=Speaker',
        logoImgSrc: 'Biu_tzadik_nobackground.png'
    },
    "original-he": {
        calloutLeft: 'או סתם ללמוד איך האקרים חושבים ופועלים',
        calloutRight: 'בואו לרכוש ידע שיכול להיות רלוונטי לקריירה שלכם!',
        title1: 'מבוא לסייבר:',
        title2: 'וירוסים ועד קריירות',
        date: 'יום חמישי, 25.12.2025',
        time: '14:00-15:00',
        location: 'בניין 503 (מדע״ח) חדר 226',
        speakerName: 'שם המרצה',
        speakerRole: 'תפקיד המרצה / חברה',
        theme: 'original',
        bgStyle: 'curves',
        cyberOverlay: 'none',
        logoVisible: true,
        logoBg: false,
        logoPosition: 'top-right',
        logoSize: 95,
        avatarZoom: 440,
        avatarX: -154,
        avatarY: -386,
        fzTitle: 36,
        fzCallouts: 15,
        fzDetails: 19,
        fzSpeaker: 22,
        verticalShift: 0,
        primaryColor: '#091e36',
        secondaryColor: '#00b0ff',
        textDarkColor: '#081c33',
        textLightColor: '#000000',
        layoutDirection: 'rtl',
        uiLanguage: 'he',
        speakerImgSrc: 'https://placehold.co/300x300/091e36/00b0ff?text=Speaker',
        logoImgSrc: 'Biu_tzadik_nobackground.png'
    },
    "original-en": {
        calloutLeft: 'Or just learn how hackers think and operate',
        calloutRight: 'Come acquire knowledge that could be relevant to your career!',
        title1: 'Introduction to Cyber:',
        title2: 'From Viruses to Careers',
        date: 'Thursday, 25.12.2025',
        time: '14:00-15:00',
        location: 'Building 503 (CS) Room 226',
        speakerName: 'Speaker Name',
        speakerRole: "Speaker's Role / Company",
        theme: 'original',
        bgStyle: 'curves',
        cyberOverlay: 'none',
        logoVisible: true,
        logoBg: false,
        logoPosition: 'top-left',
        logoSize: 95,
        avatarZoom: 440,
        avatarX: -154,
        avatarY: -386,
        fzTitle: 36,
        fzCallouts: 15,
        fzDetails: 19,
        fzSpeaker: 22,
        verticalShift: 0,
        primaryColor: '#091e36',
        secondaryColor: '#00b0ff',
        textDarkColor: '#081c33',
        textLightColor: '#000000',
        layoutDirection: 'ltr',
        uiLanguage: 'en',
        speakerImgSrc: 'https://placehold.co/300x300/091e36/00b0ff?text=Speaker',
        logoImgSrc: 'Biu_tzadik_nobackground.png'
    }
};

// UI Tab Management
function switchTab(tabId) {
    // Hide all panels
    document.getElementById('panel-content').classList.add('hidden');
    document.getElementById('panel-design').classList.add('hidden');
    document.getElementById('panel-images').classList.add('hidden');
    document.getElementById('panel-presets').classList.add('hidden');

    // Remove active button styles
    document.getElementById('tab-content').className = "flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition";
    document.getElementById('tab-design').className = "flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition";
    document.getElementById('tab-images').className = "flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition";
    document.getElementById('tab-presets').className = "flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition";

    // Show current
    document.getElementById(`panel-${tabId}`).classList.remove('hidden');
    document.getElementById(`tab-${tabId}`).className = "flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 border-emerald-500 text-emerald-400 transition";
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
/**
 * Applies a background graphic style to the canvas.
 * Loads the layout dynamic coordinates from the backgrounds/ folder if not cached.
 * @param {string} styleName - The style key to apply.
 */
function applyBackgroundStyle(styleName) {
    currentBackgroundStyle = styleName;

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

    // Toggle Custom Background Paths editor visibility
    const customSection = document.getElementById('section-custom-bg');
    if (customSection) {
        if (styleName === 'custom') {
            customSection.classList.remove('hidden');
        } else {
            customSection.classList.add('hidden');
        }
    }

    if (styleName === 'custom') {
        applyBackgroundStylePaths('custom');
        return;
    }

    // Load dynamic style using script injection if not cached (for 100% offline file:// support)
    if (!BACKGROUND_STYLES[styleName]) {
        const script = document.createElement('script');
        script.src = `backgrounds/${styleName}.js`;
        script.onload = () => {
            applyBackgroundStylePaths(styleName);
        };
        script.onerror = () => {
            console.error(`Failed to load background style script: backgrounds/${styleName}.js`);
        };
        document.body.appendChild(script);
    } else {
        applyBackgroundStylePaths(styleName);
    }
}

/**
 * Applies the SVG path data from the loaded background style to the canvas.
 * @param {string} styleName - The loaded style key.
 */
function applyBackgroundStylePaths(styleName) {
    const style = BACKGROUND_STYLES[styleName];
    if (!style) return;

    document.getElementById('svg-bg-top-left').setAttribute('d', style.topLeftD || '');
    document.getElementById('svg-bg-mid-right').setAttribute('d', style.midRightD || '');
    document.getElementById('svg-bg-bottom-right').setAttribute('d', style.bottomRightD || '');
}

/**
 * Reads user input SVG paths from UI, registers them as the 'custom' style, and applies it.
 */
function applyCustomBackground() {
    const topLeftD = document.getElementById('input-custom-bg-tl').value.trim();
    const midRightD = document.getElementById('input-custom-bg-mr').value.trim();
    const bottomRightD = document.getElementById('input-custom-bg-br').value.trim();

    BACKGROUND_STYLES.custom = {
        topLeftD: topLeftD,
        midRightD: midRightD,
        bottomRightD: bottomRightD
    };

    applyBackgroundStyle('custom');
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
    const bgColor = document.getElementById('color-logo-bg').value;
    const hasShadow = document.getElementById('toggle-logo-shadow').checked;
    const shadowColor = document.getElementById('color-logo-shadow').value;
    
    const logoCont = document.getElementById('poster-logo-container');
    const logoImg = document.getElementById('poster-logo');
    const logoFallback = document.getElementById('poster-logo-svg-fallback');

    // 1. Handle Background Panel
    if (hasBg) {
        logoCont.style.backgroundColor = bgColor;
        logoCont.style.padding = '8px';
        logoCont.style.borderRadius = '12px';
        
        if (hasShadow) {
            // Apply box-shadow to the container card
            logoCont.style.boxShadow = `0 8px 24px ${shadowColor}50, 0 2px 8px ${shadowColor}30`;
        } else {
            // Subtle gray shadow if no shadow color selected
            logoCont.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }
        
        // Remove image filters since shadow is on the card container
        if (logoImg) logoImg.style.filter = 'none';
        if (logoFallback) logoFallback.style.filter = 'none';
    } else {
        logoCont.style.backgroundColor = 'transparent';
        logoCont.style.padding = '0px';
        logoCont.style.borderRadius = '0px';
        logoCont.style.boxShadow = 'none';
        
        // 2. Handle drop-shadow directly on transparent logo shape
        if (hasShadow) {
            const filterVal = `drop-shadow(0 0 8px ${shadowColor})`;
            if (logoImg) logoImg.style.filter = filterVal;
            if (logoFallback) logoFallback.style.filter = filterVal;
        } else {
            if (logoImg) logoImg.style.filter = 'none';
            if (logoFallback) logoFallback.style.filter = 'none';
        }
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

// Set dynamic text and element layouts on the poster for LTR (English) or RTL (Hebrew)
function setPosterDirection(dir) {
    const poster = document.getElementById('cyber-poster');
    const midSection = document.getElementById('poster-mid-section');
    const detailsContainer = document.getElementById('poster-details-container');
    const titleContainer = document.getElementById('poster-title-1').parentElement;
    const calloutLeft = document.getElementById('container-callout-left');
    const calloutRight = document.getElementById('container-callout-right');
    const speakerInfo = document.getElementById('poster-speaker-name').parentElement;

    if (!poster) return;

    if (dir === 'ltr') {
        poster.setAttribute('dir', 'ltr');

        [calloutLeft, calloutRight, titleContainer, detailsContainer, speakerInfo].forEach(el => {
            if (el) {
                el.classList.remove('text-right');
                el.classList.add('text-left');
            }
        });

        if (midSection) {
            midSection.classList.remove('pr-2');
            midSection.classList.add('pl-2');
        }
        if (detailsContainer) {
            detailsContainer.classList.remove('pr-1');
            detailsContainer.classList.add('pl-1');
        }
        if (speakerInfo) {
            speakerInfo.classList.remove('pr-2');
            speakerInfo.classList.add('pl-2');
        }

        if (detailsContainer) {
            Array.from(detailsContainer.children).forEach(child => {
                child.classList.remove('flex-row-reverse');
                child.classList.add('flex-row');
            });
        }
    } else {
        poster.setAttribute('dir', 'rtl');

        [calloutLeft, calloutRight, titleContainer, detailsContainer, speakerInfo].forEach(el => {
            if (el) {
                el.classList.remove('text-left');
                el.classList.add('text-right');
            }
        });

        if (midSection) {
            midSection.classList.remove('pl-2');
            midSection.classList.add('pr-2');
        }
        if (detailsContainer) {
            detailsContainer.classList.remove('pl-1');
            detailsContainer.classList.add('pr-1');
        }
        if (speakerInfo) {
            speakerInfo.classList.remove('pl-2');
            speakerInfo.classList.add('pr-2');
        }

        if (detailsContainer) {
            Array.from(detailsContainer.children).forEach(child => {
                child.classList.remove('flex-row');
                child.classList.add('flex-row-reverse');
            });
        }
    }
}

// Translate HTML elements and set text layouts
function setUILanguage(lang) {
    currentLanguage = lang;
    
    document.documentElement.dir = (lang === 'he') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Toggle button active states in presets tab
    const btnHe = document.getElementById('btn-lang-he');
    const btnEn = document.getElementById('btn-lang-en');
    
    if (btnHe && btnEn) {
        if (lang === 'he') {
            btnHe.className = "flex-1 py-2 text-xs font-bold rounded-lg transition border border-emerald-500 bg-emerald-950/20 text-emerald-400";
            btnEn.className = "flex-1 py-2 text-xs font-bold rounded-lg transition border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300";
        } else {
            btnEn.className = "flex-1 py-2 text-xs font-bold rounded-lg transition border border-emerald-500 bg-emerald-950/20 text-emerald-400";
            btnHe.className = "flex-1 py-2 text-xs font-bold rounded-lg transition border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300";
        }
    }

    // Dynamic node replacement loop
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (UI_TRANSLATIONS[lang] && UI_TRANSLATIONS[lang][key]) {
            translateElement(el, UI_TRANSLATIONS[lang][key]);
        }
    });

    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (UI_TRANSLATIONS[lang] && UI_TRANSLATIONS[lang][key]) {
            el.setAttribute('placeholder', UI_TRANSLATIONS[lang][key]);
        }
    });

    // Redraw select options to show translated labels
    populatePresetDropdown();
    adjustPosterScale();
}

function translateElement(el, translation) {
    const svg = el.querySelector('svg');
    if (svg) {
        svg.remove();
        el.textContent = ' ' + translation;
        el.insertBefore(svg, el.firstChild);
    } else {
        el.textContent = translation;
    }
}

// Preset management algorithms
function populatePresetDropdown(activeValue = "") {
    const select = document.getElementById('select-preset');
    if (!select) return;

    const prevVal = select.value;
    select.innerHTML = '';

    // Built-ins
    for (const key in BUILT_IN_PRESETS) {
        const opt = document.createElement('option');
        opt.value = "built-in:" + key;
        opt.textContent = key.includes('-he') ? `ערכה מובנית: ${key.replace('-he', ' עברית')}` : `Built-in: ${key.replace('-en', ' English')}`;
        select.appendChild(opt);
    }

    // In-memory saves
    const customKeys = Object.keys(customPresets);
    if (customKeys.length > 0) {
        const divider = document.createElement('option');
        divider.disabled = true;
        divider.textContent = currentLanguage === 'he' ? '─── שמור בזיכרון ───' : '─── Saved in Memory ───';
        select.appendChild(divider);

        customKeys.forEach(name => {
            const opt = document.createElement('option');
            opt.value = "custom:" + name;
            opt.textContent = name;
            select.appendChild(opt);
        });
    }

    if (activeValue) {
        select.value = activeValue;
    } else if (prevVal && select.querySelector(`option[value="${prevVal}"]`)) {
        select.value = prevVal;
    }
}

function handlePresetSelect(val) {
    if (val.startsWith("built-in:")) {
        const key = val.replace("built-in:", "");
        loadPresetState(BUILT_IN_PRESETS[key]);
    } else if (val.startsWith("custom:")) {
        const name = val.replace("custom:", "");
        loadPresetState(customPresets[name]);
    }
}

function getCurrentStateAsPreset(name = "") {
    return {
        name: name,
        calloutLeft: document.getElementById('input-callout-left').value,
        calloutRight: document.getElementById('input-callout-right').value,
        title1: document.getElementById('input-title-1').value,
        title2: document.getElementById('input-title-2').value,
        date: document.getElementById('input-date').value,
        time: document.getElementById('input-time').value,
        location: document.getElementById('input-location').value,
        speakerName: document.getElementById('input-speaker-name').value,
        speakerRole: document.getElementById('input-speaker-role').value,

        theme: document.getElementById('color-primary').value === '#004124' ? 'tzadik' : 'custom',
        bgStyle: currentBackgroundStyle,
        cyberOverlay: currentCyberOverlay,

        logoVisible: document.getElementById('toggle-logo').checked,
        logoBg: document.getElementById('toggle-logo-bg').checked,
        logoBgColor: document.getElementById('color-logo-bg').value,
        logoShadow: document.getElementById('toggle-logo-shadow').checked,
        logoShadowColor: document.getElementById('color-logo-shadow').value,
        logoPosition: currentLogoPosition,
        logoSize: parseInt(document.getElementById('logo-size').value),

        avatarZoom: parseInt(document.getElementById('avatar-zoom').value),
        avatarX: parseInt(document.getElementById('avatar-x').value),
        avatarY: parseInt(document.getElementById('avatar-y').value),

        fzTitle: parseInt(document.getElementById('slider-fz-title').value),
        fzCallouts: parseInt(document.getElementById('slider-fz-callouts').value),
        fzDetails: parseInt(document.getElementById('slider-fz-details').value),
        fzSpeaker: parseInt(document.getElementById('slider-fz-speaker').value),
        verticalShift: parseInt(document.getElementById('slider-vertical-shift').value),

        primaryColor: document.getElementById('color-primary').value,
        secondaryColor: document.getElementById('color-secondary').value,
        textDarkColor: document.getElementById('color-text-on-light').value,
        textLightColor: document.getElementById('color-text-on-dark').value,

        layoutDirection: document.getElementById('cyber-poster').getAttribute('dir') || 'rtl',
        uiLanguage: currentLanguage,
        speakerImgSrc: document.getElementById('poster-speaker-img').getAttribute('src') || document.getElementById('poster-speaker-img').src,
        logoImgSrc: document.getElementById('poster-logo').getAttribute('src') || document.getElementById('poster-logo').src,
        customBgStyle: currentBackgroundStyle === 'custom' ? BACKGROUND_STYLES.custom : undefined
    };
}

function loadPresetState(preset) {
    if (!preset) return;

    // Restore custom background paths if present in the preset
    if (preset.customBgStyle) {
        BACKGROUND_STYLES.custom = preset.customBgStyle;
        if (document.getElementById('input-custom-bg-tl')) {
            document.getElementById('input-custom-bg-tl').value = preset.customBgStyle.topLeftD || '';
            document.getElementById('input-custom-bg-mr').value = preset.customBgStyle.midRightD || '';
            document.getElementById('input-custom-bg-br').value = preset.customBgStyle.bottomRightD || '';
        }
    } else {
        // Clear custom inputs if loading a built-in style
        if (document.getElementById('input-custom-bg-tl')) {
            document.getElementById('input-custom-bg-tl').value = '';
            document.getElementById('input-custom-bg-mr').value = '';
            document.getElementById('input-custom-bg-br').value = '';
        }
    }

    // Apply values
    document.getElementById('input-callout-left').value = preset.calloutLeft;
    document.getElementById('input-callout-right').value = preset.calloutRight;
    document.getElementById('input-title-1').value = preset.title1;
    document.getElementById('input-title-2').value = preset.title2;
    document.getElementById('input-date').value = preset.date;
    document.getElementById('input-time').value = preset.time;
    document.getElementById('input-location').value = preset.location;
    document.getElementById('input-speaker-name').value = preset.speakerName;
    document.getElementById('input-speaker-role').value = preset.speakerRole;

    // Apply layout bounds
    document.getElementById('slider-fz-title').value = preset.fzTitle;
    document.getElementById('slider-fz-callouts').value = preset.fzCallouts;
    document.getElementById('slider-fz-details').value = preset.fzDetails;
    document.getElementById('slider-fz-speaker').value = preset.fzSpeaker;
    document.getElementById('slider-vertical-shift').value = preset.verticalShift;

    // Apply logos
    document.getElementById('toggle-logo').checked = preset.logoVisible;
    document.getElementById('toggle-logo-bg').checked = preset.logoBg;
    document.getElementById('color-logo-bg').value = preset.logoBgColor || '#ffffff';
    document.getElementById('toggle-logo-shadow').checked = !!preset.logoShadow;
    document.getElementById('color-logo-shadow').value = preset.logoShadowColor || '#000000';
    document.getElementById('logo-size').value = preset.logoSize;

    // Apply colors
    document.getElementById('color-primary').value = preset.primaryColor;
    document.getElementById('color-secondary').value = preset.secondaryColor;
    document.getElementById('color-text-on-light').value = preset.textDarkColor;
    document.getElementById('color-text-on-dark').value = preset.textLightColor;

    document.getElementById('color-primary-hex').value = preset.primaryColor;
    document.getElementById('color-secondary-hex').value = preset.secondaryColor;
    document.getElementById('color-text-on-light-hex').value = preset.textDarkColor;
    document.getElementById('color-text-on-dark-hex').value = preset.textLightColor;

    // Apply speaker and logo images if present
    const speakerImg = document.getElementById('poster-speaker-img');
    if (preset.speakerImgSrc) {
        speakerImg.src = preset.speakerImgSrc;
    } else {
        speakerImg.src = DEFAULTS.speakerImgSrc;
    }

    const logoImg = document.getElementById('poster-logo');
    if (preset.logoImgSrc) {
        logoImg.src = preset.logoImgSrc;
        logoImg.style.display = 'block';
        document.getElementById('poster-logo-svg-fallback').classList.add('hidden');
    } else {
        logoImg.src = DEFAULTS.logoImgSrc;
        logoImg.style.display = 'block';
        document.getElementById('poster-logo-svg-fallback').classList.add('hidden');
    }

    // Set variables
    applyBackgroundStyle(preset.bgStyle);
    
    if (document.getElementById('select-cyber-overlay')) {
        document.getElementById('select-cyber-overlay').value = preset.cyberOverlay;
    }
    applyCyberOverlay(preset.cyberOverlay);

    updateLogoScale(preset.logoSize);
    updateLogoVisibility();
    updateLogoBackground();
    setLogoPosition(preset.logoPosition);

    document.getElementById('avatar-zoom').value = preset.avatarZoom;
    document.getElementById('avatar-x').value = preset.avatarX;
    document.getElementById('avatar-y').value = preset.avatarY;
    updateAvatarAdjustment();

    setPosterDirection(preset.layoutDirection || 'rtl');

    // Fire render refreshes
    updateColors();
    updatePoster();
    updateLayoutSizes();

    if (preset.uiLanguage && preset.uiLanguage !== currentLanguage) {
        setUILanguage(preset.uiLanguage);
    }
}

// In-Memory Quick Saves array storage
function saveCurrentToMemory() {
    const nameInput = document.getElementById('input-memory-preset-name');
    const name = nameInput.value.trim();

    if (!name) {
        const errorMsg = currentLanguage === 'he' ? "נא להזין שם עבור הערכה השמורה." : "Please enter a name for the saved preset.";
        alert(errorMsg);
        return;
    }

    const preset = getCurrentStateAsPreset(name);
    customPresets[name] = preset;

    // Rebuild options list and select the new custom item
    populatePresetDropdown("custom:" + name);
    nameInput.value = '';

    const successMsg = currentLanguage === 'he' ? `הערכה "${name}" נשמרה בזיכרון המקומי.` : `Preset "${name}" saved to session memory.`;
    alert(successMsg);
}

// JSON file system exports
function exportCurrentPreset() {
    const nameInput = document.getElementById('input-memory-preset-name');
    const presetName = nameInput.value.trim() || document.getElementById('poster-speaker-name').innerText + "_preset";
    const preset = getCurrentStateAsPreset(presetName);

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(preset, null, 4));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", presetName.replace(/\s+/g, '_') + ".json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// JSON file system imports
function handlePresetFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            
            // Perform light validation to make sure schema is correct
            if (!parsed.calloutLeft || !parsed.title1 || !parsed.primaryColor) {
                throw new Error("Invalid preset schema structure.");
            }

            const presetName = parsed.name || file.name.replace(".json", "");
            parsed.name = presetName;

            // Save in-memory
            customPresets[presetName] = parsed;
            
            // Select and load
            populatePresetDropdown("custom:" + presetName);
            loadPresetState(parsed);

            const successMsg = currentLanguage === 'he' ? "ערכת ה-JSON נטענה בהצלחה!" : "JSON preset loaded successfully!";
            alert(successMsg);
        } catch (err) {
            console.error("JSON Preset parsing error:", err);
            const errorMsg = currentLanguage === 'he' ? "שגיאה בטעינת הקובץ: קובץ ה-JSON אינו תקין." : "Error loading file: Invalid JSON preset structure.";
            alert(errorMsg);
        }
        // Reset file input
        event.target.value = '';
    };
    reader.readAsText(file);
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
    
    // Set UI language to English default on reset
    setUILanguage('en');
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
            <span data-i18n="png-msg">מייצר קובץ תמונה באיכות גבוהה... נא להמתין</span>
        </div>
    `;
    document.body.appendChild(msgBox);

    // Swap text for high-DPI message if English
    if (currentLanguage === 'en') {
        msgBox.querySelector('span').textContent = "Generating high-quality image file... Please wait";
    }

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

// IndexedDB helper functions to persist directory handles
const DB_NAME = 'PresetsDirectoryDB';
const DB_VERSION = 1;
const STORE_NAME = 'handles';
const KEY_NAME = 'directoryHandle';

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            db.createObjectStore(STORE_NAME);
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function saveDirectoryHandle(handle) {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(handle, KEY_NAME);
        await new Promise((resolve) => tx.oncomplete = resolve);
    } catch (err) {
        console.error('IndexedDB write error:', err);
    }
}

async function getDirectoryHandle() {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(KEY_NAME);
        return new Promise((resolve) => {
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        });
    } catch (err) {
        console.error('IndexedDB read error:', err);
        return null;
    }
}

async function selectPresetsDirectory() {
    if ('showDirectoryPicker' in window) {
        try {
            const handle = await window.showDirectoryPicker({
                mode: 'read'
            });
            await saveDirectoryHandle(handle);
            await loadPresetsFromHandle(handle);
            const syncBtn = document.getElementById('btn-sync-folder-action');
            if (syncBtn) syncBtn.classList.remove('hidden');
        } catch (err) {
            console.warn('Directory picking cancelled or failed:', err);
        }
    } else {
        const folderInput = document.getElementById('input-preset-folder');
        if (folderInput) folderInput.click();
    }
}

async function loadPresetsFromHandle(handle) {
    try {
        const opts = { mode: 'read' };
        if (await handle.queryPermission(opts) !== 'granted') {
            if (await handle.requestPermission(opts) !== 'granted') {
                throw new Error('Permission denied to read folder.');
            }
        }

        let loadedCount = 0;
        for await (const entry of handle.values()) {
            if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.json')) {
                const file = await entry.getFile();
                const text = await file.text();
                try {
                    const preset = JSON.parse(text);
                    if (preset.name && preset.primaryColor) {
                        customPresets[preset.name] = preset;
                        loadedCount++;
                    }
                } catch (e) {
                    console.warn(`Failed to parse preset file ${entry.name}:`, e);
                }
            }
        }

        if (loadedCount > 0) {
            populatePresetDropdown();
            const successMsg = currentLanguage === 'he' 
                ? `נטענו בהצלחה ${loadedCount} ערכות עיצוב מהתיקייה!` 
                : `Successfully loaded ${loadedCount} presets from folder!`;
            alert(successMsg);
        }
    } catch (err) {
        console.error('Error reading presets from handle:', err);
        const errorMsg = currentLanguage === 'he'
            ? 'שגיאה בקריאת תיקיית הערכות.'
            : 'Error reading presets from the selected folder.';
        alert(errorMsg);
    }
}

async function syncPresetsDirectory() {
    const handle = await getDirectoryHandle();
    if (handle) {
        await loadPresetsFromHandle(handle);
    } else {
        selectPresetsDirectory();
    }
}

async function handlePresetFolderUpload(event) {
    const files = event.target.files;
    let loadedCount = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.toLowerCase().endsWith('.json')) {
            const text = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsText(file);
            });
            try {
                const preset = JSON.parse(text);
                if (preset.name && preset.primaryColor) {
                    customPresets[preset.name] = preset;
                    loadedCount++;
                }
            } catch (e) {
                console.warn(`Failed to parse preset file ${file.name}:`, e);
            }
        }
    }

    if (loadedCount > 0) {
        populatePresetDropdown();
        const successMsg = currentLanguage === 'he' 
            ? `נטענו בהצלחה ${loadedCount} ערכות עיצוב מהתיקייה!` 
            : `Successfully loaded ${loadedCount} presets from folder!`;
        alert(successMsg);
    }
}

function onPresetDragOver(event) {
    event.preventDefault();
    const zone = document.getElementById('preset-drag-drop-zone');
    if (zone) {
        zone.classList.remove('border-slate-700');
        zone.classList.add('border-emerald-500', 'bg-emerald-950/10');
    }
}

function onPresetDragLeave(event) {
    event.preventDefault();
    const zone = document.getElementById('preset-drag-drop-zone');
    if (zone) {
        zone.classList.remove('border-emerald-500', 'bg-emerald-950/10');
        zone.classList.add('border-slate-700');
    }
}

async function onPresetDrop(event) {
    event.preventDefault();
    const zone = document.getElementById('preset-drag-drop-zone');
    if (zone) {
        zone.classList.remove('border-emerald-500', 'bg-emerald-950/10');
        zone.classList.add('border-slate-700');
    }

    const files = event.dataTransfer.files;
    let loadedCount = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.toLowerCase().endsWith('.json')) {
            const text = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsText(file);
            });
            try {
                const preset = JSON.parse(text);
                if (preset.name && preset.primaryColor) {
                    customPresets[preset.name] = preset;
                    loadedCount++;
                }
            } catch (e) {
                console.warn(`Failed to parse preset file ${file.name}:`, e);
            }
        }
    }

    if (loadedCount > 0) {
        populatePresetDropdown();
        const successMsg = currentLanguage === 'he' 
            ? `נטענו בהצלחה ${loadedCount} ערכות עיצוב מהגררה!` 
            : `Successfully loaded ${loadedCount} dropped presets!`;
        alert(successMsg);
    }
}

async function checkPersistedDirectory() {
    try {
        const handle = await getDirectoryHandle();
        if (handle) {
            const syncBtn = document.getElementById('btn-sync-folder-action');
            if (syncBtn) syncBtn.classList.remove('hidden');
        }
    } catch (e) {
        console.warn('Persisted directory check failed:', e);
    }

    try {
        const response = await fetch('presets/');
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'));
            
            const jsonFiles = links
                .map(link => link.getAttribute('href'))
                .filter(href => href && href.toLowerCase().endsWith('.json'));

            let count = 0;
            for (const fileUrl of jsonFiles) {
                try {
                    const res = await fetch(fileUrl);
                    if (res.ok) {
                        const preset = await res.json();
                        if (preset.name && preset.primaryColor) {
                            customPresets[preset.name] = preset;
                            count++;
                        }
                    }
                } catch (e) {
                }
            }
            if (count > 0) {
                populatePresetDropdown();
                console.log(`Auto-loaded ${count} presets from web server presets/ folder.`);
            }
        }
    } catch (err) {
    }
}

/**
 * Copies the pre-formatted system prompt instructions for generative AI to the clipboard.
 */
function copyAIPrompt() {
    const promptText = `You are a Cyber Poster Designer assistant. Your task is to output a single, raw JSON preset configuration block matching the user's event request. Do NOT write conversational explanations; output ONLY the JSON structure.

Conform strictly to the following schema definition:
- name: Unique descriptive name.
- calloutLeft: Catchy call-to-action (approx 5-8 words).
- calloutRight: Supplementary call-to-action (approx 5-8 words).
- title1: Main title line 1 (short).
- title2: Main title line 2 (short).
- date: formatted string.
- time: formatted time range.
- location: location description.
- speakerName: name of the speaker.
- speakerRole: role/company of the speaker.
- theme: "tzadik" (for deep green) or "original" (for dark navy).
- bgStyle: Choose one: "curves", "geometric", "waves", "cyber", "minimalist", "diagonal", "techno", "stripes".
- cyberOverlay: Choose one: "none", "networks", "electronics", "reversing", "exploit".
- logoVisible: boolean.
- logoBg: boolean.
- logoPosition: "top-left", "top-right", "bottom-left".
- logoSize: integer between 40 and 150 (defaults to 95).
- avatarZoom: integer between 100 and 800 (defaults to 100).
- avatarX: integer between -400 and 100 (defaults to 0).
- avatarY: integer between -600 and 100 (defaults to 0).
- fzTitle: Main title font size (defaults to 36).
- fzCallouts: Callouts font size (defaults to 15).
- fzDetails: Date/time details font size (defaults to 19).
- fzSpeaker: Speaker info font size (defaults to 22).
- verticalShift: Vertical alignment shift (defaults to 0).
- primaryColor: Hex color (matches theme e.g., "#004124" or "#091e36" or custom).
- secondaryColor: Accent hex color (e.g., "#71CCE7" or "#00b0ff" or custom).
- textDarkColor: Text color for dark fonts on light blocks.
- textLightColor: Text color for light fonts on dark blocks.
- layoutDirection: "ltr" (English) or "rtl" (Hebrew).
- uiLanguage: "en" or "he".
- speakerImgSrc: "https://placehold.co/300x300/004124/71CCE7?text=Speaker" (adjust colors to match secondary/primary).
- logoImgSrc: "Biu_tzadik_nobackground.png".`;

    navigator.clipboard.writeText(promptText).then(() => {
        const msg = currentLanguage === 'he' 
            ? 'הנחיית הבינה המלאכותית הועתקה ללוח!' 
            : 'AI prompt copied to clipboard!';
        alert(msg);
    }).catch(err => {
        console.error('Failed to copy prompt:', err);
    });
}

/**
 * Parses and loads a JSON preset pasted directly from the textarea, stripping any markdown wrappers if present.
 */
function loadPastedPreset() {
    const textarea = document.getElementById('input-ai-json');
    if (!textarea) return;

    let rawText = textarea.value.trim();
    if (!rawText) {
        const errorMsg = currentLanguage === 'he' 
            ? 'נא להזין קוד JSON.' 
            : 'Please enter JSON code.';
        alert(errorMsg);
        return;
    }

    // Strip markdown code block wraps if present (e.g. ```json ... ``` or ``` ... ```)
    rawText = rawText.replace(/^```[a-zA-Z]*\s*/, '').replace(/\s*```$/, '');

    try {
        const preset = JSON.parse(rawText);

        // Basic validation
        if (!preset.calloutLeft || !preset.title1 || !preset.primaryColor) {
            throw new Error("Missing critical preset keys.");
        }

        const presetName = preset.name || (currentLanguage === 'he' ? 'ערכת בינה מלאכותית' : 'AI Preset');
        preset.name = presetName;

        // Save in memory
        customPresets[presetName] = preset;

        // Populate and select
        populatePresetDropdown("custom:" + presetName);
        loadPresetState(preset);

        textarea.value = '';
        const successMsg = currentLanguage === 'he' 
            ? 'ערכת ה-AI נטענה בהצלחה!' 
            : 'AI preset loaded successfully!';
        alert(successMsg);
    } catch (err) {
        console.error('Error parsing pasted preset JSON:', err);
        const errorMsg = currentLanguage === 'he'
            ? 'שגיאה בפענוח ה-JSON: נא לוודא שהמבנה תקין.'
            : 'Error parsing JSON: Please ensure the format is valid.';
        alert(errorMsg);
    }
}

// Listeners and kick off triggers
window.addEventListener('resize', adjustPosterScale);

window.onload = function () {
    resetToDefaults();
    populatePresetDropdown();
    adjustPosterScale();
    checkPersistedDirectory();
}
