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

    if (layer.locked) {
        form.querySelectorAll('input, select, textarea').forEach(el => {
            el.disabled = true;
            el.classList.add('opacity-50', 'cursor-not-allowed');
        });
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
