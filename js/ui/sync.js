const layerNameTranslations = {
    he: {
        'Brand Logo 1': 'לוגו המותג',
        'Left Callout': 'בלון שמאלי (רקע בהיר)',
        'Right Callout': 'בלון ימני (רקע כהה)',
        'Title Line 1': 'שורת כותרת 1',
        'Title Line 2': 'שורת כותרת 2',
        'Event Date': 'תאריך ויום',
        'Event Time': 'שעות פעילות',
        'Event Location': 'מיקום וחדר',
        'Speaker Name': 'שם המרצה',
        'Speaker Role': 'תפקיד / חברה',
        'Speaker Portrait': 'תמונת מרצה'
    },
    en: {
        'Brand Logo 1': 'Brand Logo 1',
        'Left Callout': 'Left Callout (Light Background)',
        'Right Callout': 'Right Callout (Dark Background)',
        'Title Line 1': 'Title Line 1',
        'Title Line 2': 'Title Line 2',
        'Event Date': 'Event Date',
        'Event Time': 'Event Time',
        'Event Location': 'Event Location',
        'Speaker Name': 'Speaker Name',
        'Speaker Role': 'Speaker Role',
        'Speaker Portrait': 'Speaker Portrait'
    }
};

function renderStandardContentFields() {
    const panel = document.getElementById('panel-content');
    if (!panel) return;

    panel.innerHTML = '';

    const title = document.createElement('h3');
    title.className = 'text-xs font-bold uppercase tracking-wider text-slate-400 mb-3';
    title.textContent = currentLanguage === 'he' ? 'תוכן וטקסטים (לפי פריסה)' : 'Content & Texts (Ordered by Layout)';
    panel.appendChild(title);

    // Sort visible layers of type 'text' or 'image' by vertical position top ascending
    const editableLayers = layers
        .filter(l => l.type === 'text' || l.type === 'image')
        .sort((a, b) => (a.position.top || 0) - (b.position.top || 0));

    editableLayers.forEach(layer => {
        const fieldWrapper = document.createElement('div');
        fieldWrapper.className = 'mb-4 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80 hover:border-indigo-500/35 transition';

        const labelRow = document.createElement('div');
        labelRow.className = 'flex items-center justify-between mb-1.5';

        const label = document.createElement('label');
        label.className = 'block text-xs font-bold text-slate-300';
        
        let displayName = layer.name;
        if (layerNameTranslations[currentLanguage] && layerNameTranslations[currentLanguage][layer.name]) {
            displayName = layerNameTranslations[currentLanguage][layer.name];
        }
        label.textContent = displayName;
        labelRow.appendChild(label);

        const badge = document.createElement('span');
        badge.className = `text-[9px] px-1.5 py-0.5 rounded font-mono ${
            layer.type === 'text' ? 'bg-indigo-950 text-indigo-300' : 'bg-emerald-950 text-emerald-300'
        }`;
        badge.textContent = layer.type === 'text' ? 'TEXT' : 'IMAGE';
        labelRow.appendChild(badge);

        fieldWrapper.appendChild(labelRow);

        if (layer.type === 'text') {
            const textarea = document.createElement('textarea');
            textarea.rows = 2;
            textarea.value = layer.text || '';
            textarea.className = 'w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none';
            textarea.oninput = () => {
                layer.text = textarea.value;
                if (typeof renderPosterLayers === 'function') {
                    renderPosterLayers();
                }
            };
            fieldWrapper.appendChild(textarea);
        } else if (layer.type === 'image') {
            const uploadWrapper = document.createElement('div');
            uploadWrapper.className = 'space-y-2';

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.className = 'w-full text-xs text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-950 file:text-indigo-400 hover:file:bg-slate-800 cursor-pointer';
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        layer.src = event.target.result;
                        if (typeof renderPosterLayers === 'function') {
                            renderPosterLayers();
                        }
                        renderStandardContentFields();
                    };
                    reader.readAsDataURL(file);
                }
            };
            uploadWrapper.appendChild(fileInput);

            if (layer.src) {
                const previewImg = document.createElement('img');
                previewImg.src = layer.src;
                previewImg.className = 'h-10 w-auto rounded border border-slate-850 object-contain bg-slate-950';
                uploadWrapper.appendChild(previewImg);
            }

            fieldWrapper.appendChild(uploadWrapper);
        }

        panel.appendChild(fieldWrapper);
    });
}

function updatePoster() {
    renderStandardContentFields();
    if (typeof renderPosterLayers === 'function') {
        renderPosterLayers();
    }
}

function syncInputsFromLayers() {
    renderStandardContentFields();
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
    renderStandardContentFields();

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
