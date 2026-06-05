// Advanced Layout Drag & Drop and Resizing Engine

function ensureResizeHandle(el) {
    if (!el.querySelector('.resize-handle')) {
        const handle = document.createElement('div');
        handle.className = 'resize-handle resize-handle-br no-print';
        
        handle.addEventListener('mousedown', (e) => {
            initResize(e, el);
        });
        handle.addEventListener('touchstart', (e) => {
            initResize(e, el);
        }, { passive: false });
        
        el.appendChild(handle);
    }
}

function initResize(e, el) {
    e.preventDefault();
    e.stopPropagation();
    
    activeResizedElement = el;
    el.classList.add('adv-resizing');
    
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    
    resizeStartX = clientX;
    resizeStartY = clientY;
    
    const scale = getPosterScale();
    const layerId = el.dataset.layerId;
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
        resizeStartWidth = layer.size.width;
        resizeStartHeight = layer.size.height;
    }
}

function getSnapReferences(draggedLayerId) {
    const refsX = new Map();
    const refsY = new Map();

    // 1. Poster Center & Quarters
    refsX.set(297.5, 'poster-center');
    refsX.set(148.75, 'poster-quarter-1');
    refsX.set(446.25, 'poster-quarter-3');

    refsY.set(421, 'poster-center');
    refsY.set(210.5, 'poster-quarter-1');
    refsY.set(631.5, 'poster-quarter-3');

    // 2. Edges and Centers of other visible layers
    layers.forEach(layer => {
        if (!layer.visible || layer.id === draggedLayerId) return;

        const left = layer.position.left;
        const top = layer.position.top;
        const width = layer.size.width;
        const height = layer.size.height;
        
        const right = left + width;
        const bottom = top + height;
        const cx = left + width / 2;
        const cy = top + height / 2;

        refsX.set(left, layer.id);
        refsX.set(right, layer.id);
        refsX.set(cx, layer.id);

        refsY.set(top, layer.id);
        refsY.set(bottom, layer.id);
        refsY.set(cy, layer.id);
    });

    return { refsX, refsY };
}

function getPosterScale() {
    const scaleWrapper = document.getElementById('poster-scale-wrapper');
    if (!scaleWrapper) return 1;
    const match = scaleWrapper.style.transform.match(/scale\(([^)]+)\)/);
    return match ? parseFloat(match[1]) : 1;
}

function toggleAdvancedLayout(active) {
    isAdvancedLayout = active;
    const checkbox = document.getElementById('toggle-advanced-layout');
    if (checkbox) checkbox.checked = active;

    const resetBtn = document.getElementById('btn-reset-layout');
    if (resetBtn) {
        if (active) resetBtn.classList.remove('hidden');
        else resetBtn.classList.add('hidden');
    }

    const poster = document.getElementById('cyber-poster');
    if (poster) {
        let guideV = document.getElementById('guide-line-v');
        let guideH = document.getElementById('guide-line-h');
        
        if (active) {
            if (!guideV) {
                guideV = document.createElement('div');
                guideV.id = 'guide-line-v';
                guideV.className = 'guide-line guide-line-v no-print hidden';
                poster.appendChild(guideV);
            }
            if (!guideH) {
                guideH = document.createElement('div');
                guideH.id = 'guide-line-h';
                guideH.className = 'guide-line guide-line-h no-print hidden';
                poster.appendChild(guideH);
            }
        } else {
            if (guideV) guideV.remove();
            if (guideH) guideH.remove();
        }
    }

    if (!active) {
        selectedLayerId = null;
        const noSel = document.getElementById('layer-no-selection-msg');
        const setFm = document.getElementById('layer-settings-container');
        if (noSel) noSel.classList.remove('hidden');
        if (setFm) setFm.classList.add('hidden');
    }

    if (typeof renderPosterLayers === 'function') {
        renderPosterLayers();
    }
}

function resetAdvancedLayout() {
    // Revert to Simple Mode
    setSidebarMode('standard');
}

function initDraggableEngine() {
    const poster = document.getElementById('cyber-poster');
    const layersContainer = document.getElementById('poster-layers-container');
    if (!poster || !layersContainer) return;

    // Delegate mousedown/touchstart to layer wrapper elements
    const startDrag = (e) => {
        if (!isAdvancedLayout) return;

        const wrapper = e.target.closest('[data-layer-id]');
        if (!wrapper) return;

        const layerId = wrapper.dataset.layerId;
        
        // Ignore if clicked on a resize-handle
        if (e.target.classList.contains('resize-handle')) return;
        
        // Only drag on primary click or touch
        if (e.type === 'mousedown' && e.button !== 0) return;

        e.preventDefault();

        // Select clicked layer
        if (selectedLayerId !== layerId) {
            if (typeof selectLayer === 'function') {
                selectLayer(layerId);
            }
        }

        activeDraggedElement = wrapper;
        wrapper.classList.add('adv-dragging');

        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

        dragStartX = clientX;
        dragStartY = clientY;

        const layer = layers.find(l => l.id === layerId);
        if (layer) {
            dragStartLeft = layer.position.left;
            dragStartTop = layer.position.top;
        }
    };

    layersContainer.addEventListener('mousedown', startDrag);
    layersContainer.addEventListener('touchstart', startDrag, { passive: false });

    const onMove = (e) => {
        if (!activeDraggedElement && !activeResizedElement) return;

        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

        const scale = getPosterScale();

        if (activeResizedElement) {
            // Resizing logic
            const dx = (clientX - resizeStartX) / scale;
            const dy = (clientY - resizeStartY) / scale;
            
            let newWidth = resizeStartWidth + dx;
            let newHeight = resizeStartHeight + dy;
            
            if (newWidth < 50) newWidth = 50;
            if (newHeight < 20) newHeight = 20;
            
            const layerId = activeResizedElement.dataset.layerId;
            const layer = layers.find(l => l.id === layerId);
            if (layer) {
                if (layer.position.left + newWidth > 595) newWidth = 595 - layer.position.left;
                if (layer.position.top + newHeight > 842) newHeight = 842 - layer.position.top;
                
                layer.size.width = Math.round(newWidth);
                layer.size.height = Math.round(newHeight);
                
                // Refresh property inputs if active
                if (selectedLayerId === layerId && typeof renderLayerSettingsForm === 'function') {
                    renderLayerSettingsForm(layer);
                }

                renderPosterLayers();
            }
            return;
        }

        // Draggable move logic (with snapping!)
        const dx = (clientX - dragStartX) / scale;
        const dy = (clientY - dragStartY) / scale;

        let newLeft = dragStartLeft + dx;
        let newTop = dragStartTop + dy;

        const layerId = activeDraggedElement.dataset.layerId;
        const layer = layers.find(l => l.id === layerId);
        if (!layer) return;

        const elWidth = layer.size.width;
        const elHeight = layer.size.height;

        // Snapping calculations (8px magnetic threshold)
        const snapThreshold = 8;
        const { refsX, refsY } = getSnapReferences(layerId);

        let bestSnapX = null;
        let bestSnapDistX = Infinity;
        let snapXType = '';

        for (const [refX, source] of refsX) {
            const distLeft = Math.abs(newLeft - refX);
            if (distLeft < snapThreshold && distLeft < bestSnapDistX) {
                bestSnapDistX = distLeft;
                bestSnapX = refX;
                snapXType = 'left';
            }
            const distRight = Math.abs((newLeft + elWidth) - refX);
            if (distRight < snapThreshold && distRight < bestSnapDistX) {
                bestSnapDistX = distRight;
                bestSnapX = refX;
                snapXType = 'right';
            }
            const distCenter = Math.abs((newLeft + elWidth / 2) - refX);
            if (distCenter < snapThreshold && distCenter < bestSnapDistX) {
                bestSnapDistX = distCenter;
                bestSnapX = refX;
                snapXType = 'center';
            }
        }

        if (bestSnapX !== null) {
            if (snapXType === 'left') {
                newLeft = bestSnapX;
            } else if (snapXType === 'right') {
                newLeft = bestSnapX - elWidth;
            } else if (snapXType === 'center') {
                newLeft = bestSnapX - elWidth / 2;
            }
            const guideV = document.getElementById('guide-line-v');
            if (guideV) {
                guideV.style.left = bestSnapX + 'px';
                guideV.classList.remove('hidden');
            }
        } else {
            const guideV = document.getElementById('guide-line-v');
            if (guideV) guideV.classList.add('hidden');
        }

        let bestSnapY = null;
        let bestSnapDistY = Infinity;
        let snapYType = '';

        for (const [refY, source] of refsY) {
            const distTop = Math.abs(newTop - refY);
            if (distTop < snapThreshold && distTop < bestSnapDistY) {
                bestSnapDistY = distTop;
                bestSnapY = refY;
                snapYType = 'top';
            }
            const distBottom = Math.abs((newTop + elHeight) - refY);
            if (distBottom < snapThreshold && distBottom < bestSnapDistY) {
                bestSnapDistY = distBottom;
                bestSnapY = refY;
                snapYType = 'bottom';
            }
            const distCenter = Math.abs((newTop + elHeight / 2) - refY);
            if (distCenter < snapThreshold && distCenter < bestSnapDistY) {
                bestSnapDistY = distCenter;
                bestSnapY = refY;
                snapYType = 'center';
            }
        }

        if (bestSnapY !== null) {
            if (snapYType === 'top') {
                newTop = bestSnapY;
            } else if (snapYType === 'bottom') {
                newTop = bestSnapY - elHeight;
            } else if (snapYType === 'center') {
                newTop = bestSnapY - elHeight / 2;
            }
            const guideH = document.getElementById('guide-line-h');
            if (guideH) {
                guideH.style.top = bestSnapY + 'px';
                guideH.classList.remove('hidden');
            }
        } else {
            const guideH = document.getElementById('guide-line-h');
            if (guideH) guideH.classList.add('hidden');
        }

        // Keep inside boundary
        if (newLeft < 0) newLeft = 0;
        if (newLeft + elWidth > 595) newLeft = 595 - elWidth;
        if (newTop < 0) newTop = 0;
        if (newTop + elHeight > 842) newTop = 842 - elHeight;

        layer.position.left = Math.round(newLeft);
        layer.position.top = Math.round(newTop);

        // Refresh property inputs if active
        if (selectedLayerId === layerId && typeof renderLayerSettingsForm === 'function') {
            renderLayerSettingsForm(layer);
        }

        renderPosterLayers();
    };

    const onEnd = () => {
        if (activeDraggedElement) {
            activeDraggedElement.classList.remove('adv-dragging');
            activeDraggedElement = null;
        }
        if (activeResizedElement) {
            activeResizedElement.classList.remove('adv-resizing');
            activeResizedElement = null;
        }
        
        // Hide guide lines
        const guideV = document.getElementById('guide-line-v');
        const guideH = document.getElementById('guide-line-h');
        if (guideV) guideV.classList.add('hidden');
        if (guideH) guideH.classList.add('hidden');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
}
