// Core Layers Rendering and Layout Engine

function renderPosterLayers() {
    const container = document.getElementById('poster-layers-container');
    if (!container) return;

    // Clear existing rendered layers
    container.innerHTML = '';

    // Sort layers by zIndex ascending so higher zIndex layers render on top
    const sortedLayers = [...layers].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    // Get current visual context values
    const verticalShift = parseInt(document.getElementById('slider-vertical-shift')?.value || 0);
    const layoutDirection = document.getElementById('cyber-poster')?.getAttribute('dir') || 'rtl';
    const isRtl = layoutDirection === 'rtl';

    // Auto-calculate positions in Simple Mode to prevent overlaps
    let logoOffsetLeft = 0;
    let logoOffsetRight = 0;
    let logoOffsetBottomLeft = 0;

    const logoLayer = layers.find(l => l.id === 'layer_logo_1');
    if (logoLayer && logoLayer.visible && !isAdvancedLayout) {
        const logoSize = logoLayer.size.width;
        const logoBgEl = document.getElementById('toggle-logo-bg');
        const extraPadding = (logoBgEl && logoBgEl.checked) ? 16 : 0;
        const totalLogoWidth = logoSize + extraPadding + 24; // Width + padding + safety margin

        if (currentLogoPosition === 'top-left') {
            logoOffsetLeft = totalLogoWidth;
        } else if (currentLogoPosition === 'top-right') {
            logoOffsetRight = totalLogoWidth;
        } else if (currentLogoPosition === 'bottom-left') {
            logoOffsetBottomLeft = totalLogoWidth;
        }
    }

    // Dynamic top calculations for the titles and details to avoid vertical overlaps
    const title1Layer = layers.find(l => l.id === 'layer_title_1');
    const title1Fz = (title1Layer && title1Layer.visible) ? title1Layer.fontSize : 36;
    
    const title2Layer = layers.find(l => l.id === 'layer_title_2');
    const title2Fz = (title2Layer && title2Layer.visible) ? title2Layer.fontSize : 34;

    const dateLayer = layers.find(l => l.id === 'layer_date');
    const dateFz = (dateLayer && dateLayer.visible) ? dateLayer.fontSize : 19;

    const timeLayer = layers.find(l => l.id === 'layer_time');
    const timeFz = (timeLayer && timeLayer.visible) ? timeLayer.fontSize : 19;

    const title1Top = 250 + verticalShift;
    const title2Top = title1Top + title1Fz + 14; // default gap: 36 + 14 = 50
    const dateTop = title2Top + title2Fz + 46;    // default gap: 34 + 46 = 80
    const timeTop = dateTop + dateFz + 21;        // default gap: 19 + 21 = 40
    const locationTop = timeTop + timeFz + 21;    // default gap: 19 + 21 = 40

    sortedLayers.forEach(layer => {
        if (!layer.visible) return;

        const wrapper = document.createElement('div');
        wrapper.id = layer.id;
        wrapper.dataset.layerId = layer.id;
        wrapper.style.position = 'absolute';
        wrapper.style.zIndex = layer.zIndex;
        wrapper.style.display = 'block';
        wrapper.style.pointerEvents = 'auto'; // allow mouse events on individual elements

        // Calculate positions based on mode
        let left = layer.position.left;
        let top = layer.position.top;
        let width = layer.size.width;
        let height = layer.size.height;

        if (!isAdvancedLayout) {
            // Apply Simple Mode constraints to default layers
            if (layer.id === 'layer_logo_1') {
                if (currentLogoPosition === 'top-left') {
                    left = 32;
                    top = 32;
                } else if (currentLogoPosition === 'top-right') {
                    left = 595 - 32 - width;
                    top = 32;
                } else if (currentLogoPosition === 'bottom-left') {
                    left = 32;
                    top = 842 - 32 - height;
                }
            } else if (layer.id === 'layer_callout_left') {
                left = 32 + logoOffsetLeft;
                top = currentLogoPosition === 'top-left' ? 44 : 32; // Slight downward push if logo shares corner
                width = 230 - (currentLogoPosition === 'top-left' ? 16 : 0);
            } else if (layer.id === 'layer_callout_right') {
                left = 595 - 32 - width - logoOffsetRight;
                top = currentLogoPosition === 'top-right' ? 44 : 32; // Slight downward push if logo shares corner
                width = 240 - (currentLogoPosition === 'top-right' ? 16 : 0);
            } else if (layer.id === 'layer_title_1') {
                left = 32;
                top = title1Top;
                width = 531;
            } else if (layer.id === 'layer_title_2') {
                left = 32;
                top = title2Top;
                width = 531;
            } else if (layer.id === 'layer_date') {
                left = 32;
                top = dateTop;
                width = 531;
            } else if (layer.id === 'layer_time') {
                left = 32;
                top = timeTop;
                width = 531;
            } else if (layer.id === 'layer_location') {
                left = 32;
                top = locationTop;
                width = 531;
            } else if (layer.id === 'layer_speaker_portrait') {
                if (isRtl) {
                    left = 413;
                } else {
                    left = 32 + logoOffsetBottomLeft;
                }
                top = 640;
            } else if (layer.id === 'layer_speaker_name') {
                if (isRtl) {
                    left = 32 + logoOffsetBottomLeft;
                } else {
                    left = 213 + logoOffsetBottomLeft;
                }
                top = 660;
                width = 340 - logoOffsetBottomLeft;
            } else if (layer.id === 'layer_speaker_role') {
                if (isRtl) {
                    left = 32 + logoOffsetBottomLeft;
                } else {
                    left = 213 + logoOffsetBottomLeft;
                }
                top = 700;
                width = 340 - logoOffsetBottomLeft;
            }
        }

        // Apply calculated visual geometry properties
        wrapper.style.left = left + 'px';
        wrapper.style.top = top + 'px';
        wrapper.style.width = width + 'px';
        wrapper.style.height = height + 'px';

        // Draw selection boundaries & drag styles if Advanced Mode is active
        if (isAdvancedLayout) {
            wrapper.classList.add('adv-draggable');
            if (selectedLayerId === layer.id) {
                wrapper.classList.add('adv-selected');
                wrapper.style.outline = '2px solid #ec4899'; // Selected layer highlighted in Pink
                wrapper.style.outlineOffset = '2px';
                ensureResizeHandle(wrapper);
            }
        }

        // Render contents based on layer type
        if (layer.type === 'text') {
            const textNode = document.createElement('div');
            textNode.className = 'w-full h-full break-words';
            textNode.innerText = layer.text || '';

            // Apply font family classes
            if (layer.fontFamily === 'font-secular') {
                textNode.classList.add('poster-font-title');
            } else if (layer.fontFamily === 'font-varela') {
                textNode.classList.add('poster-font-sub');
            }

            // Apply font size
            textNode.style.fontSize = layer.fontSize + 'px';

            // Alignment handling: English (LTR) vs Hebrew/Arabic (RTL)
            let align = layer.alignment || 'auto';
            if (align === 'auto') {
                // If contains Hebrew letters, align right. Else default LTR left.
                const hasHebrew = /[\u0590-\u05FF]/.test(layer.text || '');
                align = hasHebrew ? 'right' : 'left';
            }
            textNode.style.textAlign = align;

            // Apply color mode configurations
            let color = '#ffffff';
            if (layer.colorMode === 'theme-light') {
                color = document.getElementById('color-text-on-light')?.value || '#0f2219';
            } else if (layer.colorMode === 'theme-dark') {
                color = document.getElementById('color-text-on-dark')?.value || '#ffffff';
            } else if (layer.colorMode === 'custom') {
                color = layer.colorHex || '#ffffff';
            }
            textNode.style.color = color;

            wrapper.appendChild(textNode);
        } else if (layer.type === 'image') {
            // Apply background padding
            const hasBg = layer.hasBg;
            const bgColor = layer.bgColorHex || '#ffffff';
            const hasShadow = layer.hasShadow;
            const shadowColor = layer.shadowColorHex || '#000000';
            const shadowType = layer.shadowType || 'glow';

            if (hasBg) {
                wrapper.style.backgroundColor = bgColor;
                wrapper.style.padding = '8px';
                wrapper.style.borderRadius = '12px';

                if (hasShadow) {
                    if (shadowType === 'glow') {
                        wrapper.style.boxShadow = `0 8px 24px ${shadowColor}50, 0 2px 8px ${shadowColor}30`;
                        wrapper.style.border = 'none';
                    } else {
                        wrapper.style.border = `2px solid ${shadowColor}`;
                        wrapper.style.boxShadow = 'none';
                    }
                } else {
                    wrapper.style.border = 'none';
                    wrapper.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }
            } else {
                wrapper.style.backgroundColor = 'transparent';
                wrapper.style.padding = '0px';
                wrapper.style.borderRadius = '0px';
                wrapper.style.boxShadow = 'none';
                wrapper.style.border = 'none';
            }

            const imgFrame = document.createElement('div');
            imgFrame.className = 'w-full h-full relative overflow-hidden';

            const img = document.createElement('img');
            img.src = layer.src || 'https://placehold.co/150';
            img.alt = layer.name;

            if (layer.shape === 'circle') {
                imgFrame.style.borderRadius = '50%';
                img.style.position = 'absolute';
                img.style.maxWidth = 'none';
                img.style.originTopLeft = '0 0';

                // Apply crop coordinates
                const zoom = layer.crop?.zoom || 100;
                const cropX = layer.crop?.x || 0;
                const cropY = layer.crop?.y || 0;

                img.style.width = zoom + '%';
                img.style.left = cropX + 'px';
                img.style.top = cropY + 'px';
            } else {
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
            }

            // Apply direct filters if no card background container
            if (!hasBg && hasShadow) {
                let filterVal;
                if (shadowType === 'glow') {
                    filterVal = `drop-shadow(0 0 8px ${shadowColor})`;
                } else {
                    filterVal = `drop-shadow(1.5px 0px 0px ${shadowColor}) drop-shadow(-1.5px 0px 0px ${shadowColor}) drop-shadow(0px 1.5px 0px ${shadowColor}) drop-shadow(0px -1.5px 0px ${shadowColor})`;
                }
                img.style.filter = filterVal;
            } else {
                img.style.filter = 'none';
            }

            // Fallback for default brand logo if SVG fallback needed
            if (layer.id === 'layer_logo_1') {
                img.onerror = () => {
                    img.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.style.width = '100%';
                    fallback.style.height = '100%';
                    fallback.innerHTML = `
                        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                            <rect x="94" y="272" width="135" height="58" rx="16" fill="#71CCE7" class="logo-fallback-accent" />
                            <rect x="81" y="81" width="57" height="57" rx="16" fill="#004124" class="logo-fallback-primary" />
                            <rect x="126" y="126" width="57" height="57" rx="16" fill="#004124" class="logo-fallback-primary" />
                            <rect x="171" y="171" width="57" height="57" rx="16" fill="#004124" class="logo-fallback-primary" />
                            <rect x="171" y="216" width="57" height="57" rx="16" fill="#004124" class="logo-fallback-primary" />
                            <rect x="299" y="81" width="57" height="57" rx="16" fill="#004124" class="logo-fallback-primary" />
                            <rect x="254" y="126" width="57" height="57" rx="16" fill="#004124" class="logo-fallback-primary" />
                            <rect x="211" y="171" width="57" height="57" rx="16" fill="#004124" class="logo-fallback-primary" />
                            <circle cx="200" cy="200" r="12" fill="#71CCE7" class="logo-fallback-accent" />
                        </svg>
                    `;
                    // Color sync fallback SVGs
                    const primary = document.getElementById('color-primary')?.value || '#004124';
                    const secondary = document.getElementById('color-secondary')?.value || '#71CCE7';
                    fallback.querySelectorAll('.logo-fallback-primary').forEach(el => el.setAttribute('fill', primary));
                    fallback.querySelectorAll('.logo-fallback-accent').forEach(el => el.setAttribute('fill', secondary));
                    imgFrame.appendChild(fallback);
                };
            }

            imgFrame.appendChild(img);
            wrapper.appendChild(imgFrame);
        }

        container.appendChild(wrapper);
    });
}
