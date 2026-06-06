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

        // Left section: Visibility + Lock icon + Name
        const infoDiv = document.createElement('div');
        infoDiv.className = 'flex items-center gap-2 overflow-hidden';

        const visCheckbox = document.createElement('input');
        visCheckbox.type = 'checkbox';
        visCheckbox.checked = layer.visible;
        visCheckbox.className = 'accent-emerald-500 cursor-pointer h-3.5 w-3.5';
        visCheckbox.title = layer.visible ? 'Visible – click to hide' : 'Hidden – click to show';
        visCheckbox.onclick = (e) => {
            e.stopPropagation();
            layer.visible = visCheckbox.checked;
            renderPosterLayers();
            populateAdvancedLayersList();
        };
        infoDiv.appendChild(visCheckbox);

        // Lock indicator (small icon next to name)
        if (layer.locked) {
            const lockIcon = document.createElement('span');
            lockIcon.innerHTML = `<svg class="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>`;
            lockIcon.className = 'opacity-80 flex-shrink-0 flex items-center justify-center';
            lockIcon.title = 'Locked';
            infoDiv.appendChild(lockIcon);
        }

        const labelText = document.createElement('span');
        labelText.textContent = layer.name;
        labelText.className = 'truncate' + (!layer.visible ? ' line-through opacity-40' : '');
        infoDiv.appendChild(labelText);

        row.appendChild(infoDiv);

        // Right section: Lock + Duplicate + Reorder + Delete
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'flex items-center gap-1 flex-shrink-0';

        // Lock/Unlock toggle
        const btnLock = document.createElement('button');
        btnLock.innerHTML = layer.locked
            ? `<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>`
            : `<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"/></svg>`;
        btnLock.className = `p-1 rounded transition flex items-center justify-center ${
            layer.locked
                ? 'bg-amber-950/30 border border-amber-800/40 text-amber-400 hover:bg-amber-900/50'
                : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white'
        }`;
        btnLock.title = layer.locked ? 'Unlock layer (allow drag/resize)' : 'Lock layer (prevent drag/resize)';
        btnLock.onclick = (e) => {
            e.stopPropagation();
            layer.locked = !layer.locked;
            populateAdvancedLayersList();
            renderPosterLayers();
        };
        actionsDiv.appendChild(btnLock);

        // Duplicate
        const btnDup = document.createElement('button');
        btnDup.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>`;
        btnDup.className = 'p-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition flex items-center justify-center';
        btnDup.title = 'Duplicate layer';
        btnDup.onclick = (e) => {
            e.stopPropagation();
            duplicateLayer(layer.id);
        };
        actionsDiv.appendChild(btnDup);

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

        // Allow deleting any layer
        const btnDel = document.createElement('button');
        btnDel.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;
        btnDel.className = 'p-1 bg-red-950/20 border border-red-900/30 hover:bg-red-900 hover:text-white rounded text-red-400 transition flex items-center justify-center';
        btnDel.title = 'Delete Layer';
        btnDel.onclick = (e) => {
            e.stopPropagation();
            deleteLayer(layer.id);
        };
        actionsDiv.appendChild(btnDel);

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

// Global non-blocking custom confirm dialog
function showCustomConfirm(message, title, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const titleEl = document.getElementById('confirm-modal-title');
    const msgEl = document.getElementById('confirm-modal-message');
    const btnCancel = document.getElementById('confirm-modal-btn-cancel');
    const btnConfirm = document.getElementById('confirm-modal-btn-confirm');

    if (!modal || !titleEl || !msgEl || !btnCancel || !btnConfirm) {
        if (confirm(message)) onConfirm();
        return;
    }

    titleEl.textContent = title || (currentLanguage === 'he' ? 'אישור פעולה' : 'Confirm Action');
    msgEl.textContent = message;
    btnCancel.textContent = currentLanguage === 'he' ? 'ביטול' : 'Cancel';
    btnConfirm.textContent = currentLanguage === 'he' ? 'מחק' : 'Delete';

    modal.classList.remove('hidden');

    const close = () => {
        modal.classList.add('hidden');
        btnConfirm.onclick = null;
        btnCancel.onclick = null;
    };

    btnConfirm.onclick = () => {
        close();
        onConfirm();
    };

    btnCancel.onclick = () => {
        close();
    };
}

// Delete layer
function deleteLayer(layerId) {
    const index = layers.findIndex(l => l.id === layerId);
    if (index !== -1) {
        const title = currentLanguage === 'he' ? 'מחיקת שכבה' : 'Delete Layer';
        const confirmMsg = currentLanguage === 'he' 
            ? 'האם אתה בטוח שברצונך למחוק שכבה זו?' 
            : 'Are you sure you want to delete this layer?';
        
        showCustomConfirm(confirmMsg, title, () => {
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
            if (typeof renderStandardContentFields === 'function') {
                renderStandardContentFields();
            }
        });
    }
}

// Duplicate a layer (deep copy with offset position)
function duplicateLayer(layerId) {
    const original = layers.find(l => l.id === layerId);
    if (!original) return;

    const clone = JSON.parse(JSON.stringify(original));
    clone.id = 'custom_' + original.type + '_' + Date.now();
    clone.name = original.name + ' (Copy)';
    clone.zIndex = Math.max(...layers.map(l => l.zIndex || 0)) + 1;
    // Offset position slightly so user can see the duplicate
    clone.position.left += 20;
    clone.position.top += 20;
    clone.locked = false;

    layers.push(clone);
    selectLayer(clone.id);
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
