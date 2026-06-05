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

// Sidebar Mode Switch (Standard Tab View vs Advanced Layer Manager)
function setSidebarMode(mode) {
    const stdContainer = document.getElementById('standard-editor-container');
    const advContainer = document.getElementById('panel-advanced-layers');
    const btnStd = document.getElementById('btn-mode-standard');
    const btnAdv = document.getElementById('btn-mode-advanced');

    if (mode === 'advanced') {
        stdContainer.classList.add('hidden');
        advContainer.classList.remove('hidden');
        btnAdv.className = "flex-1 py-2 text-[11px] font-bold rounded-lg transition border border-emerald-500 bg-emerald-950/20 text-emerald-400";
        btnStd.className = "flex-1 py-2 text-[11px] font-bold rounded-lg transition border border-slate-700 bg-slate-950 text-slate-400 hover:text-slate-200";
        toggleAdvancedLayout(true);
        populateAdvancedLayersList();
    } else {
        advContainer.classList.add('hidden');
        stdContainer.classList.remove('hidden');
        btnStd.className = "flex-1 py-2 text-[11px] font-bold rounded-lg transition border border-emerald-500 bg-emerald-950/20 text-emerald-400";
        btnAdv.className = "flex-1 py-2 text-[11px] font-bold rounded-lg transition border border-slate-700 bg-slate-950 text-slate-400 hover:text-slate-200";
        toggleAdvancedLayout(false);
        syncInputsFromLayers();
    }
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

// Dynamic Text Updates - writes directly to layer model
function updatePoster() {
    const mappings = {
        'input-callout-left': 'layer_callout_left',
        'input-callout-right': 'layer_callout_right',
        'input-title-1': 'layer_title_1',
        'input-title-2': 'layer_title_2',
        'input-date': 'layer_date',
        'input-time': 'layer_time',
        'input-location': 'layer_location',
        'input-speaker-name': 'layer_speaker_name',
        'input-speaker-role': 'layer_speaker_role'
    };

    for (const inputId in mappings) {
        const el = document.getElementById(inputId);
        if (el) {
            const layer = layers.find(l => l.id === mappings[inputId]);
            if (layer) {
                layer.text = el.value;
            }
        }
    }

    if (typeof renderPosterLayers === 'function') {
        renderPosterLayers();
    }
}

// Sync form inputs in Standard Editor from current layers model
function syncInputsFromLayers() {
    const mappings = {
        'input-callout-left': 'layer_callout_left',
        'input-callout-right': 'layer_callout_right',
        'input-title-1': 'layer_title_1',
        'input-title-2': 'layer_title_2',
        'input-date': 'layer_date',
        'input-time': 'layer_time',
        'input-location': 'layer_location',
        'input-speaker-name': 'layer_speaker_name',
        'input-speaker-role': 'layer_speaker_role'
    };

    for (const inputId in mappings) {
        const el = document.getElementById(inputId);
        if (el) {
            const layer = layers.find(l => l.id === mappings[inputId]);
            if (layer) {
                el.value = layer.text || '';
            }
        }
    }
}

// Update font sizes and alignment to prevent clipping - writes to layer model
function updateLayoutSizes() {
    const fzTitle = parseInt(document.getElementById('slider-fz-title').value);
    const fzCallouts = parseInt(document.getElementById('slider-fz-callouts').value);
    const fzDetails = parseInt(document.getElementById('slider-fz-details').value);
    const fzSpeaker = parseInt(document.getElementById('slider-fz-speaker').value);
    const verticalShift = document.getElementById('slider-vertical-shift').value;

    // Update labels
    document.getElementById('lbl-fz-title').innerText = fzTitle + 'px';
    document.getElementById('lbl-fz-callouts').innerText = fzCallouts + 'px';
    document.getElementById('lbl-fz-details').innerText = fzDetails + 'px';
    document.getElementById('lbl-fz-speaker').innerText = fzSpeaker + 'px';
    document.getElementById('lbl-vertical-shift').innerText = verticalShift + 'px';

    // Apply to layers array
    layers.forEach(layer => {
        if (layer.id === 'layer_title_1') layer.fontSize = fzTitle;
        if (layer.id === 'layer_title_2') layer.fontSize = fzTitle - 2;
        if (layer.id === 'layer_callout_left') layer.fontSize = fzCallouts;
        if (layer.id === 'layer_callout_right') layer.fontSize = fzCallouts;
        if (layer.id === 'layer_date') layer.fontSize = fzDetails;
        if (layer.id === 'layer_time') layer.fontSize = fzDetails;
        if (layer.id === 'layer_location') layer.fontSize = fzDetails - 2;
        if (layer.id === 'layer_speaker_name') layer.fontSize = fzSpeaker;
    });

    if (typeof renderPosterLayers === 'function') {
        renderPosterLayers();
    }
}

// Font family switcher
function updateFont(fontClass) {
    layers.forEach(layer => {
        if (layer.id === 'layer_title_1' || layer.id === 'layer_title_2' || layer.id === 'layer_speaker_name') {
            if (fontClass === 'font-varela') {
                layer.fontFamily = 'font-varela';
            } else if (fontClass === 'font-secular') {
                layer.fontFamily = 'font-secular';
            } else {
                layer.fontFamily = 'font-rubik';
            }
        }
    });

    if (typeof renderPosterLayers === 'function') {
        renderPosterLayers();
    }
}

// Set dynamic text and element layouts on the poster for LTR (English) or RTL (Hebrew)
function setPosterDirection(dir) {
    const poster = document.getElementById('cyber-poster');
    if (!poster) return;
    poster.setAttribute('dir', dir);

    if (typeof renderPosterLayers === 'function') {
        renderPosterLayers();
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

    if (typeof renderPosterLayers === 'function') {
        renderPosterLayers();
    }
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

// ----------------------------------------------------
// ADVANCED LAYERS MANAGER UI PROCEDURES
// ----------------------------------------------------

function populateAdvancedLayersList() {
    const listContainer = document.getElementById('layers-list-container');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    // Order layers by zIndex descending (top layers first)
    const sorted = [...layers].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

    sorted.forEach(layer => {
        const row = document.createElement('div');
        const isSelected = selectedLayerId === layer.id;
        row.className = `flex items-center justify-between p-2 rounded-lg text-xs transition border cursor-pointer ${
            isSelected 
                ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200 font-bold' 
                : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:bg-slate-900/60'
        }`;
        
        row.onclick = (e) => {
            // Prevent trigger if clicking action buttons
            if (e.target.closest('button') || e.target.closest('input')) return;
            selectLayer(layer.id);
        };

        // Left section: Visibility + Name
        const infoDiv = document.createElement('div');
        infoDiv.className = 'flex items-center gap-2 overflow-hidden';

        const visCheckbox = document.createElement('input');
        visCheckbox.type = 'checkbox';
        visCheckbox.checked = layer.visible;
        visCheckbox.className = 'accent-emerald-500 cursor-pointer h-3.5 w-3.5';
        visCheckbox.onclick = (e) => {
            e.stopPropagation();
            layer.visible = visCheckbox.checked;
            renderPosterLayers();
        };
        infoDiv.appendChild(visCheckbox);

        const labelText = document.createElement('span');
        labelText.textContent = layer.name;
        labelText.className = 'truncate';
        infoDiv.appendChild(labelText);

        row.appendChild(infoDiv);

        // Right section: Reorder controls + Delete
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'flex items-center gap-1.5 flex-shrink-0';

        const btnUp = document.createElement('button');
        btnUp.innerHTML = '▲';
        btnUp.className = 'p-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded text-[9px] text-slate-400 hover:text-white transition';
        btnUp.title = 'Move Up (Raise)';
        btnUp.onclick = (e) => {
            e.stopPropagation();
            moveLayerZIndex(layer.id, 'up');
        };
        actionsDiv.appendChild(btnUp);

        const btnDown = document.createElement('button');
        btnDown.innerHTML = '▼';
        btnDown.className = 'p-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded text-[9px] text-slate-400 hover:text-white transition';
        btnDown.title = 'Move Down (Lower)';
        btnDown.onclick = (e) => {
            e.stopPropagation();
            moveLayerZIndex(layer.id, 'down');
        };
        actionsDiv.appendChild(btnDown);

        // Only allow deleting custom layers
        if (layer.id.startsWith('custom_')) {
            const btnDel = document.createElement('button');
            btnDel.innerHTML = '🗑';
            btnDel.className = 'p-1 bg-red-950/20 border border-red-900/30 hover:bg-red-900 hover:text-white rounded text-[10px] text-red-400 transition';
            btnDel.title = 'Delete Layer';
            btnDel.onclick = (e) => {
                e.stopPropagation();
                deleteLayer(layer.id);
            };
            actionsDiv.appendChild(btnDel);
        }

        row.appendChild(actionsDiv);
        listContainer.appendChild(row);
    });
}

function selectLayer(layerId) {
    selectedLayerId = layerId;
    populateAdvancedLayersList();

    const noSelectionMsg = document.getElementById('layer-no-selection-msg');
    const settingsForm = document.getElementById('layer-settings-container');

    const layer = layers.find(l => l.id === layerId);
    if (layer) {
        noSelectionMsg.classList.add('hidden');
        settingsForm.classList.remove('hidden');
        renderLayerSettingsForm(layer);
    } else {
        noSelectionMsg.classList.remove('hidden');
        settingsForm.classList.add('hidden');
    }

    renderPosterLayers();
}

function renderLayerSettingsForm(layer) {
    const form = document.getElementById('layer-settings-container');
    form.innerHTML = '';

    // Title / Header
    const title = document.createElement('h5');
    title.className = 'text-xs font-bold text-indigo-400 uppercase tracking-wide mb-3';
    title.textContent = `עריכת שכבה: ${layer.name}`;
    form.appendChild(title);

    // 1. Rename Field
    const groupName = createFormGroup('שם השכבה (Name):');
    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.value = layer.name;
    inputName.className = 'w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white';
    inputName.oninput = () => {
        layer.name = inputName.value;
        populateAdvancedLayersList();
    };
    groupName.appendChild(inputName);
    form.appendChild(groupName);

    // 2. Position & Geometry parameters
    const geomGrid = document.createElement('div');
    geomGrid.className = 'grid grid-cols-2 gap-2 mb-3';

    // Left/Top position coordinates
    const gL = createFormGroup('מיקום X (Left px):');
    const iL = createNumberInput(layer.position.left, (val) => {
        layer.position.left = val;
        renderPosterLayers();
    });
    gL.appendChild(iL);
    geomGrid.appendChild(gL);

    const gT = createFormGroup('מיקום Y (Top px):');
    const iT = createNumberInput(layer.position.top, (val) => {
        layer.position.top = val;
        renderPosterLayers();
    });
    gT.appendChild(iT);
    geomGrid.appendChild(gT);

    // Width/Height sizes
    const gW = createFormGroup('רוחב (Width px):');
    const iW = createNumberInput(layer.size.width, (val) => {
        layer.size.width = val;
        renderPosterLayers();
    });
    gW.appendChild(iW);
    geomGrid.appendChild(gW);

    const gH = createFormGroup('גובה (Height px):');
    const iH = createNumberInput(layer.size.height, (val) => {
        layer.size.height = val;
        renderPosterLayers();
    });
    gH.appendChild(iH);
    geomGrid.appendChild(gH);

    form.appendChild(geomGrid);

    // 3. Text Controls (Text Layer)
    if (layer.type === 'text') {
        // Text Content textarea
        const gText = createFormGroup('תוכן הטקסט (Text):');
        const taText = document.createElement('textarea');
        taText.rows = 3;
        taText.value = layer.text || '';
        taText.className = 'w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500';
        taText.oninput = () => {
            layer.text = taText.value;
            renderPosterLayers();
        };
        gText.appendChild(taText);
        form.appendChild(gText);

        // Font Size slider
        const gFz = createFormGroup('גודל גופן (Font Size):');
        const sliderFz = document.createElement('input');
        sliderFz.type = 'range';
        sliderFz.min = 10;
        sliderFz.max = 60;
        sliderFz.value = layer.fontSize || 16;
        sliderFz.className = 'w-full accent-indigo-500';
        const valFz = document.createElement('span');
        valFz.className = 'text-[10px] text-slate-400 font-mono block mt-1';
        valFz.textContent = `${sliderFz.value}px`;
        sliderFz.oninput = () => {
            layer.fontSize = parseInt(sliderFz.value);
            valFz.textContent = `${sliderFz.value}px`;
            renderPosterLayers();
        };
        gFz.appendChild(sliderFz);
        gFz.appendChild(valFz);
        form.appendChild(gFz);

        // Font Family dropdown
        const gFont = createFormGroup('סוג גופן (Font Family):');
        const selFont = document.createElement('select');
        selFont.className = 'w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white';
        const families = {
            'font-secular': 'Secular One (Title)',
            'font-varela': 'Varela Round (Sub)',
            'font-rubik': 'Rubik (Standard)'
        };
        for (const val in families) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = families[val];
            if (layer.fontFamily === val) opt.selected = true;
            selFont.appendChild(opt);
        }
        selFont.onchange = () => {
            layer.fontFamily = selFont.value;
            renderPosterLayers();
        };
        gFont.appendChild(selFont);
        form.appendChild(gFont);

        // Color Mode dropdown
        const gColor = createFormGroup('צבע (Color Mode):');
        const selColor = document.createElement('select');
        selColor.className = 'w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mb-2';
        const modes = {
            'theme-light': 'צבע על רקע בהיר (Theme Light)',
            'theme-dark': 'צבע על רקע כהה (Theme Dark)',
            'custom': 'צבע מותאם אישית (Custom Hex)'
        };
        for (const val in modes) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = modes[val];
            if (layer.colorMode === val) opt.selected = true;
            selColor.appendChild(opt);
        }
        
        const pickerContainer = document.createElement('div');
        pickerContainer.className = 'flex items-center gap-2 hidden';
        const pickerColor = document.createElement('input');
        pickerColor.type = 'color';
        pickerColor.value = layer.colorHex || '#ffffff';
        pickerColor.className = 'w-8 h-8 rounded border-0 cursor-pointer bg-transparent';
        const inputColorHex = document.createElement('input');
        inputColorHex.type = 'text';
        inputColorHex.value = layer.colorHex || '#ffffff';
        inputColorHex.className = 'w-24 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-center text-white';

        pickerColor.oninput = () => {
            layer.colorHex = pickerColor.value;
            inputColorHex.value = pickerColor.value;
            renderPosterLayers();
        };
        inputColorHex.oninput = () => {
            if (/^#[0-9A-F]{6}$/i.test(inputColorHex.value)) {
                layer.colorHex = inputColorHex.value;
                pickerColor.value = inputColorHex.value;
                renderPosterLayers();
            }
        };

        selColor.onchange = () => {
            layer.colorMode = selColor.value;
            if (selColor.value === 'custom') {
                pickerContainer.classList.remove('hidden');
            } else {
                pickerContainer.classList.add('hidden');
            }
            renderPosterLayers();
        };

        if (layer.colorMode === 'custom') {
            pickerContainer.classList.remove('hidden');
        }

        pickerContainer.appendChild(pickerColor);
        pickerContainer.appendChild(inputColorHex);
        gColor.appendChild(selColor);
        gColor.appendChild(pickerContainer);
        form.appendChild(gColor);

        // Alignment dropdown
        const gAlign = createFormGroup('יישור טקסט (Alignment):');
        const selAlign = document.createElement('select');
        selAlign.className = 'w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white';
        const aligns = {
            'auto': 'יישור אוטומטי (Auto - LTR/RTL)',
            'left': 'שמאל (Left)',
            'right': 'ימין (Right)',
            'center': 'מרכז (Center)'
        };
        for (const val in aligns) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = aligns[val];
            if (layer.alignment === val) opt.selected = true;
            selAlign.appendChild(opt);
        }
        selAlign.onchange = () => {
            layer.alignment = selAlign.value;
            renderPosterLayers();
        };
        gAlign.appendChild(selAlign);
        form.appendChild(gAlign);
    } 
    
    // 4. Image Controls (Image Layer)
    else if (layer.type === 'image') {
        // Image source file upload
        const gFile = createFormGroup('העלאת תמונה (Upload Image):');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.className = 'w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-indigo-400 hover:file:bg-slate-800 cursor-pointer';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    layer.src = event.target.result;
                    renderPosterLayers();
                };
                reader.readAsDataURL(file);
            }
        };
        gFile.appendChild(fileInput);
        form.appendChild(gFile);

        // Image shape
        const gShape = createFormGroup('צורת תמונה (Shape):');
        const selShape = document.createElement('select');
        selShape.className = 'w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mb-2';
        const shapes = {
            'rect': 'מלבני (Rectangle / Logo)',
            'circle': 'עיגול (Circle / Speaker Portrait)'
        };
        for (const val in shapes) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = shapes[val];
            if (layer.shape === val) opt.selected = true;
            selShape.appendChild(opt);
        }

        // Crop Sliders container
        const cropContainer = document.createElement('div');
        cropContainer.className = 'space-y-3 bg-slate-900 p-3 rounded-lg border border-slate-800 hidden';

        // Zoom Slider
        const zLabel = document.createElement('label');
        zLabel.className = 'block text-[10px] text-slate-400 mb-0.5';
        zLabel.textContent = 'זום (Zoom):';
        const sliderZoom = document.createElement('input');
        sliderZoom.type = 'range';
        sliderZoom.min = 100;
        sliderZoom.max = 800;
        sliderZoom.value = layer.crop?.zoom || 100;
        sliderZoom.className = 'w-full accent-indigo-500';
        const valZoom = document.createElement('span');
        valZoom.className = 'text-[9px] text-slate-500 font-mono block';
        valZoom.textContent = `${sliderZoom.value}%`;
        sliderZoom.oninput = () => {
            if (!layer.crop) layer.crop = { x: 0, y: 0, zoom: 100 };
            layer.crop.zoom = parseInt(sliderZoom.value);
            valZoom.textContent = `${sliderZoom.value}%`;
            renderPosterLayers();
        };
        cropContainer.appendChild(zLabel);
        cropContainer.appendChild(sliderZoom);
        cropContainer.appendChild(valZoom);

        // Crop X Slider
        const xLabel = document.createElement('label');
        xLabel.className = 'block text-[10px] text-slate-400 mb-0.5 mt-2';
        xLabel.textContent = 'הסטה אופקית (Crop X):';
        const sliderX = document.createElement('input');
        sliderX.type = 'range';
        sliderX.min = -400;
        sliderX.max = 200;
        sliderX.value = layer.crop?.x || 0;
        sliderX.className = 'w-full accent-indigo-500';
        const valX = document.createElement('span');
        valX.className = 'text-[9px] text-slate-500 font-mono block';
        valX.textContent = `${sliderX.value}px`;
        sliderX.oninput = () => {
            if (!layer.crop) layer.crop = { x: 0, y: 0, zoom: 100 };
            layer.crop.x = parseInt(sliderX.value);
            valX.textContent = `${sliderX.value}px`;
            renderPosterLayers();
        };
        cropContainer.appendChild(xLabel);
        cropContainer.appendChild(sliderX);
        cropContainer.appendChild(valX);

        // Crop Y Slider
        const yLabel = document.createElement('label');
        yLabel.className = 'block text-[10px] text-slate-400 mb-0.5 mt-2';
        yLabel.textContent = 'הסטה אנכית (Crop Y):';
        const sliderY = document.createElement('input');
        sliderY.type = 'range';
        sliderY.min = -600;
        sliderY.max = 200;
        sliderY.value = layer.crop?.y || 0;
        sliderY.className = 'w-full accent-indigo-500';
        const valY = document.createElement('span');
        valY.className = 'text-[9px] text-slate-500 font-mono block';
        valY.textContent = `${sliderY.value}px`;
        sliderY.oninput = () => {
            if (!layer.crop) layer.crop = { x: 0, y: 0, zoom: 100 };
            layer.crop.y = parseInt(sliderY.value);
            valY.textContent = `${sliderY.value}px`;
            renderPosterLayers();
        };
        cropContainer.appendChild(yLabel);
        cropContainer.appendChild(sliderY);
        cropContainer.appendChild(valY);

        selShape.onchange = () => {
            layer.shape = selShape.value;
            if (selShape.value === 'circle') {
                cropContainer.classList.remove('hidden');
            } else {
                cropContainer.classList.add('hidden');
            }
            renderPosterLayers();
        };

        if (layer.shape === 'circle') {
            cropContainer.classList.remove('hidden');
        }

        gShape.appendChild(selShape);
        gShape.appendChild(cropContainer);
        form.appendChild(gShape);

        // Image background card panel
        const gBgCard = createFormGroup('רקע פאנל ללוגו (Background Card):');
        const flexBg = document.createElement('div');
        flexBg.className = 'flex items-center justify-between mb-2';
        const labelBg = document.createElement('span');
        labelBg.className = 'text-[11px] text-slate-400';
        labelBg.textContent = 'הצג כרטיס רקע:';
        const checkBg = document.createElement('input');
        checkBg.type = 'checkbox';
        checkBg.checked = !!layer.hasBg;
        checkBg.className = 'accent-emerald-500 h-4 w-4 cursor-pointer';

        const colorContainer = document.createElement('div');
        colorContainer.className = 'flex items-center gap-2 hidden';
        const pickerBg = document.createElement('input');
        pickerBg.type = 'color';
        pickerBg.value = layer.bgColorHex || '#ffffff';
        pickerBg.className = 'w-8 h-8 rounded border-0 cursor-pointer bg-transparent';
        const inputBgHex = document.createElement('input');
        inputBgHex.type = 'text';
        inputBgHex.value = layer.bgColorHex || '#ffffff';
        inputBgHex.className = 'w-24 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-center text-white';

        pickerBg.oninput = () => {
            layer.bgColorHex = pickerBg.value;
            inputBgHex.value = pickerBg.value;
            renderPosterLayers();
        };
        inputBgHex.oninput = () => {
            if (/^#[0-9A-F]{6}$/i.test(inputBgHex.value)) {
                layer.bgColorHex = inputBgHex.value;
                pickerBg.value = inputBgHex.value;
                renderPosterLayers();
            }
        };

        checkBg.onchange = () => {
            layer.hasBg = checkBg.checked;
            if (checkBg.checked) {
                colorContainer.classList.remove('hidden');
            } else {
                colorContainer.classList.add('hidden');
            }
            renderPosterLayers();
        };

        if (layer.hasBg) {
            colorContainer.classList.remove('hidden');
        }

        flexBg.appendChild(labelBg);
        flexBg.appendChild(checkBg);
        colorContainer.appendChild(pickerBg);
        colorContainer.appendChild(inputBgHex);
        gBgCard.appendChild(flexBg);
        gBgCard.appendChild(colorContainer);
        form.appendChild(gBgCard);

        // Shadows config
        const gShadow = createFormGroup('אפקט צל (Logo Shadow):');
        const flexSh = document.createElement('div');
        flexSh.className = 'flex items-center justify-between mb-2';
        const labelSh = document.createElement('span');
        labelSh.className = 'text-[11px] text-slate-400';
        labelSh.textContent = 'הפעל צל/הילה:';
        const checkSh = document.createElement('input');
        checkSh.type = 'checkbox';
        checkSh.checked = !!layer.hasShadow;
        checkSh.className = 'accent-emerald-500 h-4 w-4 cursor-pointer';

        const shadowDetails = document.createElement('div');
        shadowDetails.className = 'space-y-2.5 hidden';

        // Shadow Type
        const sTypeGrid = document.createElement('div');
        sTypeGrid.className = 'flex items-center justify-between';
        const sTypeLabel = document.createElement('span');
        sTypeLabel.className = 'text-[10px] text-slate-500';
        sTypeLabel.textContent = 'סגנון צל:';
        const selSType = document.createElement('select');
        selSType.className = 'bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white';
        const stypes = {
            'glow': 'הילה (Glow)',
            'outline': 'מסגרת (Outline)'
        };
        for (const val in stypes) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = stypes[val];
            if (layer.shadowType === val) opt.selected = true;
            selSType.appendChild(opt);
        }
        selSType.onchange = () => {
            layer.shadowType = selSType.value;
            renderPosterLayers();
        };
        sTypeGrid.appendChild(sTypeLabel);
        sTypeGrid.appendChild(selSType);
        shadowDetails.appendChild(sTypeGrid);

        // Shadow Color
        const sColorGrid = document.createElement('div');
        sColorGrid.className = 'flex items-center justify-between';
        const sColorLabel = document.createElement('span');
        sColorLabel.className = 'text-[10px] text-slate-500';
        sColorLabel.textContent = 'צבע צל:';
        const sColorPicker = document.createElement('input');
        sColorPicker.type = 'color';
        sColorPicker.value = layer.shadowColorHex || '#000000';
        sColorPicker.className = 'w-7 h-7 cursor-pointer border-0 bg-transparent';
        sColorPicker.oninput = () => {
            layer.shadowColorHex = sColorPicker.value;
            renderPosterLayers();
        };
        sColorGrid.appendChild(sColorLabel);
        sColorGrid.appendChild(sColorPicker);
        shadowDetails.appendChild(sColorGrid);

        checkSh.onchange = () => {
            layer.hasShadow = checkSh.checked;
            if (checkSh.checked) {
                shadowDetails.classList.remove('hidden');
            } else {
                shadowDetails.classList.add('hidden');
            }
            renderPosterLayers();
        };

        if (layer.hasShadow) {
            shadowDetails.classList.remove('hidden');
        }

        flexSh.appendChild(labelSh);
        flexSh.appendChild(checkSh);
        gShadow.appendChild(flexSh);
        gShadow.appendChild(shadowDetails);
        form.appendChild(gShadow);
    }
}

function createFormGroup(labelText) {
    const div = document.createElement('div');
    div.className = 'mb-3';
    const label = document.createElement('label');
    label.className = 'block text-[11px] text-slate-400 font-bold mb-1';
    label.textContent = labelText;
    div.appendChild(label);
    return div;
}

function createNumberInput(initialValue, onUpdate) {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = initialValue;
    input.className = 'w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-mono';
    input.oninput = () => {
        const val = parseInt(input.value) || 0;
        onUpdate(val);
    };
    return input;
}

// Add dynamic text layer
function addCustomTextLayer() {
    const id = 'custom_text_' + Date.now();
    const newTextLayer = {
        id: id,
        name: 'Custom Text block ' + (layers.filter(l => l.id.startsWith('custom_text_')).length + 1),
        type: 'text',
        position: { left: 150, top: 350 },
        size: { width: 300, height: 50 },
        visible: true,
        zIndex: layers.length + 1,
        text: 'Custom Text Block',
        fontSize: 20,
        fontFamily: 'font-secular',
        colorMode: 'theme-dark',
        alignment: 'center'
    };
    layers.push(newTextLayer);
    selectLayer(id);
}

// Add dynamic image layer
function addCustomImageLayer() {
    const id = 'custom_img_' + Date.now();
    const newImgLayer = {
        id: id,
        name: 'Custom Image block ' + (layers.filter(l => l.id.startsWith('custom_img_')).length + 1),
        type: 'image',
        position: { left: 200, top: 400 },
        size: { width: 100, height: 100 },
        visible: true,
        zIndex: layers.length + 1,
        src: 'https://placehold.co/150/091e36/00b0ff?text=Logo',
        shape: 'rect',
        crop: { x: 0, y: 0, zoom: 100 },
        hasBg: false,
        bgColorHex: '#ffffff',
        hasShadow: false,
        shadowColorHex: '#000000',
        shadowType: 'glow'
    };
    layers.push(newImgLayer);
    selectLayer(id);
}

// Delete layer
function deleteLayer(layerId) {
    const index = layers.findIndex(l => l.id === layerId);
    if (index !== -1) {
        const confirmMsg = currentLanguage === 'he' 
            ? 'האם אתה בטוח שברצונך למחוק שכבה זו?' 
            : 'Are you sure you want to delete this layer?';
        if (confirm(confirmMsg)) {
            layers.splice(index, 1);
            if (selectedLayerId === layerId) {
                selectedLayerId = null;
                const noSel = document.getElementById('layer-no-selection-msg');
                const setFm = document.getElementById('layer-settings-container');
                if (noSel) noSel.classList.remove('hidden');
                if (setFm) setFm.classList.add('hidden');
            }
            populateAdvancedLayersList();
            renderPosterLayers();
        }
    }
}

// Reorder z-index stacking layers
function moveLayerZIndex(layerId, direction) {
    const index = layers.findIndex(l => l.id === layerId);
    if (index === -1) return;

    // Retrieve active layers sorted by current zIndex
    const sorted = [...layers].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const sortedIndex = sorted.findIndex(l => l.id === layerId);

    if (direction === 'up' && sortedIndex < sorted.length - 1) {
        // Swap with the item above it in sorted stack
        const nextItem = sorted[sortedIndex + 1];
        const currentLayer = layers.find(l => l.id === layerId);
        const nextLayer = layers.find(l => l.id === nextItem.id);
        
        // Swap z-index values
        const temp = currentLayer.zIndex;
        currentLayer.zIndex = nextLayer.zIndex;
        nextLayer.zIndex = temp;
    } else if (direction === 'down' && sortedIndex > 0) {
        // Swap with the item below it in sorted stack
        const prevItem = sorted[sortedIndex - 1];
        const currentLayer = layers.find(l => l.id === layerId);
        const prevLayer = layers.find(l => l.id === prevItem.id);
        
        // Swap z-index values
        const temp = currentLayer.zIndex;
        currentLayer.zIndex = prevLayer.zIndex;
        prevLayer.zIndex = temp;
    }

    populateAdvancedLayersList();
    renderPosterLayers();
}
