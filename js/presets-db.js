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
        theme: document.getElementById('color-primary').value === '#004124' ? 'tzadik' : 'custom',
        bgStyle: currentBackgroundStyle,
        cyberOverlay: currentCyberOverlay,

        primaryColor: document.getElementById('color-primary').value,
        secondaryColor: document.getElementById('color-secondary').value,
        textDarkColor: document.getElementById('color-text-on-light').value,
        textLightColor: document.getElementById('color-text-on-dark').value,

        layoutDirection: document.getElementById('cyber-poster').getAttribute('dir') || 'rtl',
        uiLanguage: currentLanguage,
        isAdvancedLayout: isAdvancedLayout,

        layers: JSON.parse(JSON.stringify(layers)) // deep copy layers array
    };
}

function loadPresetState(preset) {
    if (!preset) return;

    // 1. Load Global Style Contexts
    currentBackgroundStyle = preset.bgStyle || 'curves';
    currentCyberOverlay = preset.cyberOverlay || 'none';
    currentLanguage = preset.uiLanguage || 'en';

    document.getElementById('color-primary').value = preset.primaryColor;
    document.getElementById('color-secondary').value = preset.secondaryColor;
    document.getElementById('color-text-on-light').value = preset.textDarkColor;
    document.getElementById('color-text-on-dark').value = preset.textLightColor;

    document.getElementById('color-primary-hex').value = preset.primaryColor;
    document.getElementById('color-secondary-hex').value = preset.secondaryColor;
    document.getElementById('color-text-on-light-hex').value = preset.textDarkColor;
    document.getElementById('color-text-on-dark-hex').value = preset.textLightColor;

    // Apply Background curves style
    applyBackgroundStyle(preset.bgStyle);
    
    // Apply overlays
    if (document.getElementById('select-cyber-overlay')) {
        document.getElementById('select-cyber-overlay').value = preset.cyberOverlay;
    }
    applyCyberOverlay(preset.cyberOverlay);

    // Set layout direction
    setPosterDirection(preset.layoutDirection || 'rtl');

    // 2. Load or Migrate Layers Data model
    if (preset.layers && Array.isArray(preset.layers)) {
        layers = JSON.parse(JSON.stringify(preset.layers));
        isAdvancedLayout = !!preset.isAdvancedLayout;
    } else {
        // LEGACY PRESET MIGRATION PATHWAY
        layers = getLayersDefaultTemplate();
        isAdvancedLayout = false;

        // Map text values
        setLayerText('layer_callout_left', preset.calloutLeft);
        setLayerText('layer_callout_right', preset.calloutRight);
        setLayerText('layer_title_1', preset.title1);
        setLayerText('layer_title_2', preset.title2);
        setLayerText('layer_date', preset.date);
        setLayerText('layer_time', preset.time);
        setLayerText('layer_location', preset.location);
        setLayerText('layer_speaker_name', preset.speakerName);
        setLayerText('layer_speaker_role', preset.speakerRole);

        // Map font sizes
        if (preset.fzTitle) {
            setLayerFz('layer_title_1', preset.fzTitle);
            setLayerFz('layer_title_2', preset.fzTitle - 2);
        }
        if (preset.fzCallouts) {
            setLayerFz('layer_callout_left', preset.fzCallouts);
            setLayerFz('layer_callout_right', preset.fzCallouts);
        }
        if (preset.fzDetails) {
            setLayerFz('layer_date', preset.fzDetails);
            setLayerFz('layer_time', preset.fzDetails);
            setLayerFz('layer_location', preset.fzDetails - 2);
        }
        if (preset.fzSpeaker) {
            setLayerFz('layer_speaker_name', preset.fzSpeaker);
        }

        // Map logo properties
        const logo = layers.find(l => l.id === 'layer_logo_1');
        if (logo) {
            logo.visible = preset.logoVisible !== undefined ? preset.logoVisible : true;
            logo.size.width = preset.logoSize || 95;
            logo.size.height = preset.logoSize || 95;
            logo.hasBg = !!preset.logoBg;
            logo.bgColorHex = preset.logoBgColor || '#ffffff';
            logo.hasShadow = !!preset.logoShadow;
            logo.shadowColorHex = preset.logoShadowColor || '#000000';
            logo.shadowType = preset.logoShadowType || 'glow';
            if (preset.logoImgSrc) logo.src = preset.logoImgSrc;

            // Simple Mode position overrides
            const lSize = logo.size.width;
            if (preset.logoPosition === 'top-left') {
                logo.position = { left: 32, top: 32 };
            } else if (preset.logoPosition === 'top-right') {
                logo.position = { left: 595 - 32 - lSize, top: 32 };
            } else if (preset.logoPosition === 'bottom-left') {
                logo.position = { left: 32, top: 842 - 32 - lSize };
            }
        }

        // Map speaker portrait properties
        const speaker = layers.find(l => l.id === 'layer_speaker_portrait');
        if (speaker) {
            if (preset.speakerImgSrc) speaker.src = preset.speakerImgSrc;
            speaker.crop = {
                x: preset.avatarX !== undefined ? preset.avatarX : -154,
                y: preset.avatarY !== undefined ? preset.avatarY : -386,
                zoom: preset.avatarZoom !== undefined ? preset.avatarZoom : 440
            };
        }

        // Map custom positions from old advancedLayout coordinates
        if (preset.advancedLayout) {
            isAdvancedLayout = true;
            for (const legId in preset.advancedLayout) {
                const pos = preset.advancedLayout[legId];
                if (legId === 'poster-logo-container') {
                    migrateLayerGeom('layer_logo_1', pos);
                } else if (legId === 'container-callout-left') {
                    migrateLayerGeom('layer_callout_left', pos);
                } else if (legId === 'container-callout-right') {
                    migrateLayerGeom('layer_callout_right', pos);
                } else if (legId === 'poster-title-container') {
                    migrateLayerGeom('layer_title_1', pos);
                    migrateLayerGeom('layer_title_2', { left: pos.left, top: pos.top + 50 });
                } else if (legId === 'poster-details-container') {
                    migrateLayerGeom('layer_date', pos);
                    migrateLayerGeom('layer_time', { left: pos.left, top: pos.top + 30 });
                    migrateLayerGeom('layer_location', { left: pos.left, top: pos.top + 60 });
                } else if (legId === 'poster-speaker-container') {
                    migrateLayerGeom('layer_speaker_name', pos);
                    migrateLayerGeom('layer_speaker_role', { left: pos.left, top: pos.top + 40 });
                    // Place portrait to the right of text if RTL, or left if LTR
                    const portraitX = (preset.layoutDirection === 'ltr') ? pos.left : pos.left + 380;
                    migrateLayerGeom('layer_speaker_portrait', { left: portraitX, top: pos.top });
                }
            }
        }
    }

    // 3. Update Standard Tab UI Inputs to match active layer values
    syncStandardDOMInputs();

    // Trigger full layers redraw
    toggleAdvancedLayout(isAdvancedLayout);
    if (isAdvancedLayout) {
        populateAdvancedLayersList();
    }
}

// Helper: set text in layer template
function setLayerText(id, text) {
    if (text === undefined) return;
    const l = layers.find(layer => layer.id === id);
    if (l) l.text = text;
}

// Helper: set font size in layer template
function setLayerFz(id, size) {
    if (!size) return;
    const l = layers.find(layer => layer.id === id);
    if (l) l.fontSize = size;
}

// Helper: migrate geometry coordinates
function migrateLayerGeom(id, pos) {
    const l = layers.find(layer => layer.id === id);
    if (l && pos) {
        l.position.left = Math.round(parseFloat(pos.left) || 0);
        l.position.top = Math.round(parseFloat(pos.top) || 0);
        if (pos.width) l.size.width = Math.round(parseFloat(pos.width) || l.size.width);
        if (pos.height) l.size.height = Math.round(parseFloat(pos.height) || l.size.height);
    }
}

// Syncs standard HTML forms with active layers state
function syncStandardDOMInputs() {
    const cL = layers.find(l => l.id === 'layer_callout_left');
    const cR = layers.find(l => l.id === 'layer_callout_right');
    const t1 = layers.find(l => l.id === 'layer_title_1');
    const t2 = layers.find(l => l.id === 'layer_title_2');
    const date = layers.find(l => l.id === 'layer_date');
    const time = layers.find(l => l.id === 'layer_time');
    const loc = layers.find(l => l.id === 'layer_location');
    const sName = layers.find(l => l.id === 'layer_speaker_name');
    const sRole = layers.find(l => l.id === 'layer_speaker_role');
    const logo = layers.find(l => l.id === 'layer_logo_1');
    const speaker = layers.find(l => l.id === 'layer_speaker_portrait');

    // Values
    if (cL && document.getElementById('input-callout-left')) document.getElementById('input-callout-left').value = cL.text || '';
    if (cR && document.getElementById('input-callout-right')) document.getElementById('input-callout-right').value = cR.text || '';
    if (t1 && document.getElementById('input-title-1')) document.getElementById('input-title-1').value = t1.text || '';
    if (t2 && document.getElementById('input-title-2')) document.getElementById('input-title-2').value = t2.text || '';
    if (date && document.getElementById('input-date')) document.getElementById('input-date').value = date.text || '';
    if (time && document.getElementById('input-time')) document.getElementById('input-time').value = time.text || '';
    if (loc && document.getElementById('input-location')) document.getElementById('input-location').value = loc.text || '';
    if (sName && document.getElementById('input-speaker-name')) document.getElementById('input-speaker-name').value = sName.text || '';
    if (sRole && document.getElementById('input-speaker-role')) document.getElementById('input-speaker-role').value = sRole.text || '';

    // Sliders
    if (t1 && document.getElementById('slider-fz-title')) document.getElementById('slider-fz-title').value = t1.fontSize || 36;
    if (cL && document.getElementById('slider-fz-callouts')) document.getElementById('slider-fz-callouts').value = cL.fontSize || 15;
    if (date && document.getElementById('slider-fz-details')) document.getElementById('slider-fz-details').value = date.fontSize || 19;
    if (sName && document.getElementById('slider-fz-speaker')) document.getElementById('slider-fz-speaker').value = sName.fontSize || 22;

    // Logos controls
    if (logo) {
        if (document.getElementById('toggle-logo')) document.getElementById('toggle-logo').checked = logo.visible;
        if (document.getElementById('toggle-logo-bg')) document.getElementById('toggle-logo-bg').checked = logo.hasBg;
        if (document.getElementById('color-logo-bg')) document.getElementById('color-logo-bg').value = logo.bgColorHex || '#ffffff';
        if (document.getElementById('toggle-logo-shadow')) document.getElementById('toggle-logo-shadow').checked = logo.hasShadow;
        if (document.getElementById('color-logo-shadow')) document.getElementById('color-logo-shadow').value = logo.shadowColorHex || '#000000';
        currentLogoShadowType = logo.shadowType || 'glow';
        
        // Highlight active shadow button
        const btnGlow = document.getElementById('btn-shadow-type-glow');
        const btnOutline = document.getElementById('btn-shadow-type-outline');
        if (btnGlow && btnOutline) {
            if (currentLogoShadowType === 'glow') {
                btnGlow.className = "px-2.5 py-1 text-[10px] font-semibold bg-emerald-950/45 border border-emerald-500/30 text-emerald-400 rounded-md transition animate-none";
                btnOutline.className = "px-2.5 py-1 text-[10px] font-semibold text-slate-400 hover:text-slate-200 rounded-md transition";
            } else {
                btnOutline.className = "px-2.5 py-1 text-[10px] font-semibold bg-emerald-950/45 border border-emerald-500/30 text-emerald-400 rounded-md transition animate-none";
                btnGlow.className = "px-2.5 py-1 text-[10px] font-semibold text-slate-400 hover:text-slate-200 rounded-md transition";
            }
        }

        if (document.getElementById('logo-size')) document.getElementById('logo-size').value = logo.size.width;
        if (document.getElementById('logo-size-lbl')) document.getElementById('logo-size-lbl').innerText = logo.size.width + 'px';
    }

    // Speaker portrait crop sliders
    if (speaker && speaker.crop) {
        if (document.getElementById('avatar-zoom')) document.getElementById('avatar-zoom').value = speaker.crop.zoom || 100;
        if (document.getElementById('avatar-x')) document.getElementById('avatar-x').value = speaker.crop.x || 0;
        if (document.getElementById('avatar-y')) document.getElementById('avatar-y').value = speaker.crop.y || 0;

        if (document.getElementById('zoom-lbl')) document.getElementById('zoom-lbl').innerText = (speaker.crop.zoom || 100) + '%';
        if (document.getElementById('x-lbl')) document.getElementById('x-lbl').innerText = (speaker.crop.x || 0) + 'px';
        if (document.getElementById('y-lbl')) document.getElementById('y-lbl').innerText = (speaker.crop.y || 0) + 'px';
    }

    // Toggle Mode in DOM
    const toggleAdv = document.getElementById('toggle-advanced-layout');
    if (toggleAdv) toggleAdv.checked = isAdvancedLayout;

    // Sync all Standard Editor inputs from the current layers array
    if (typeof syncInputsFromLayers === 'function') {
        syncInputsFromLayers();
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
    const presetName = nameInput.value.trim() || (layers.find(l => l.id === 'layer_speaker_name')?.text || 'Speaker') + "_preset";
    const preset = getCurrentStateAsPreset(presetName);

    const jsonString = JSON.stringify(preset, null, 4);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
    const blobUrl = URL.createObjectURL(blob);

    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = presetName.replace(/\s+/g, '_') + ".json";
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(blobUrl);
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
            if (!parsed.primaryColor) {
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
    // Reset layers array to fresh default template
    layers = getLayersDefaultTemplate();
    selectedLayerId = null;

    // Reset visibility of images
    const logo = layers.find(l => l.id === 'layer_logo_1');
    if (logo) {
        logo.visible = DEFAULTS.logoVisible;
        logo.size.width = DEFAULTS.logoSize;
        logo.size.height = DEFAULTS.logoSize;
    }

    // Text values in DOM
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
    currentLogoShadowType = DEFAULTS.logoShadowType || 'glow';
    setLogoShadowType(currentLogoShadowType);
    setLogoPosition(DEFAULTS.logoPosition);
    updateLogoScale(DEFAULTS.logoSize);
    updateLogoVisibility();

    // Speaker original preset
    restoreOriginalSpeakerPreset();
    updatePoster();
    updateLayoutSizes();
    
    // Reset Advanced Layout Mode & Sidebar View
    setSidebarMode('standard');

    // Set UI language to English default on reset
    setUILanguage('en');
}

// Background curves script loaders
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

function applyBackgroundStylePaths(styleName) {
    const style = BACKGROUND_STYLES[styleName];
    if (!style) return;

    document.getElementById('svg-bg-top-left').setAttribute('d', style.topLeftD || '');
    document.getElementById('svg-bg-mid-right').setAttribute('d', style.midRightD || '');
    document.getElementById('svg-bg-bottom-right').setAttribute('d', style.bottomRightD || '');
}

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

// Cyber overlays
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
    let fallbackNeeded = false;
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
            console.warn('Directory picking failed or was cancelled:', err);
            if (err.name !== 'AbortError') {
                fallbackNeeded = true;
            }
        }
    } else {
        fallbackNeeded = true;
    }

    if (fallbackNeeded) {
        const folderInput = document.getElementById('input-preset-folder');
        if (folderInput) {
            folderInput.click();
        }
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
                    if (preset.primaryColor) {
                        customPresets[preset.name || entry.name.replace('.json', '')] = preset;
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
                if (preset.primaryColor) {
                    customPresets[preset.name || file.name.replace('.json', '')] = preset;
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
                if (preset.primaryColor) {
                    customPresets[preset.name || file.name.replace('.json', '')] = preset;
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
                        if (preset.primaryColor) {
                            customPresets[preset.name || fileUrl.split('/').pop().replace('.json', '')] = preset;
                            count++;
                        }
                    }
                } catch (e) {
                }
            }
            if (count > 0) {
                populatePresetDropdown();
                console.log(`Auto-loaded ${count} presets from presets/ folder.`);
            }
        }
    } catch (err) {
    }
}

// Fallback text copying function for non-secure contexts like offline file:// protocol
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let successful = false;
    try {
        successful = document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy error:', err);
    } finally {
        document.body.removeChild(textArea);
    }
    return successful;
}

function copyAIPrompt() {
    const promptText = `You are a Cyber Poster Designer assistant. Your task is to output a single, raw JSON preset configuration block matching the user's event request. Do NOT write conversational explanations; output ONLY the JSON structure.

Conform strictly to the following schema definition:
- name: Unique descriptive name.
- theme: "tzadik" (for deep green) or "original" (for dark navy).
- bgStyle: "curves", "geometric", "waves", "cyber", "minimalist", "diagonal", "techno", "stripes".
- cyberOverlay: "none", "networks", "electronics", "reversing", "exploit".
- primaryColor: Hex color (matches theme e.g., "#004124" or "#091e36").
- secondaryColor: Accent hex color (e.g., "#71CCE7" or "#00b0ff").
- textDarkColor: Text color for dark fonts on light blocks.
- textLightColor: Text color for light fonts on dark blocks.
- layoutDirection: "ltr" (English) or "rtl" (Hebrew).
- uiLanguage: "en" or "he".
- isAdvancedLayout: boolean.
- layers: Array of Layer objects. Default template contains:
  - layer_logo_1: Brand Logo image.
  - layer_callout_left: Left Callout text.
  - layer_callout_right: Right Callout text.
  - layer_title_1: Title Line 1 text.
  - layer_title_2: Title Line 2 text.
  - layer_date: Date text.
  - layer_time: Time text.
  - layer_location: Location text.
  - layer_speaker_name: Speaker Name text.
  - layer_speaker_role: Speaker Role text.
  - layer_speaker_portrait: Speaker Portrait image.
  And any additional custom text/image layers. Each layer has id, name, type, position {left, top}, size {width, height}, visible, zIndex, and details.`;

    const successMsg = currentLanguage === 'he' 
        ? 'הנחיית הבינה המלאכותית הועתקה ללוח!' 
        : 'AI prompt copied to clipboard!';
    const failMsg = currentLanguage === 'he'
        ? 'שגיאה בהעתקת הטקסט. נא להעתיק ידנית.'
        : 'Failed to copy prompt. Please copy it manually.';

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(promptText).then(() => {
            alert(successMsg);
        }).catch(err => {
            if (fallbackCopyTextToClipboard(promptText)) {
                alert(successMsg);
            } else {
                alert(failMsg);
            }
        });
    } else {
        if (fallbackCopyTextToClipboard(promptText)) {
            alert(successMsg);
        } else {
            alert(failMsg);
        }
    }
}

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

    // Strip markdown code block wraps if present
    rawText = rawText.replace(/^```[a-zA-Z]*\s*/, '').replace(/\s*```$/, '');

    try {
        const preset = JSON.parse(rawText);

        if (!preset.primaryColor) {
            throw new Error("Missing critical preset keys.");
        }

        const presetName = preset.name || (currentLanguage === 'he' ? 'ערכת בינה מלאכותית' : 'AI Preset');
        preset.name = presetName;

        customPresets[presetName] = preset;

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
