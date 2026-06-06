# Outstanding Issues & Improvements - Poster Maker

This document logs identified bugs, UI/UX shortcomings, and design refinements for the Poster Maker.

---

## 🐛 Bugs & Security Constraints

### 1. Locked Layers Modifiable via Sidebar Inputs
*   **Problem**: While locking a layer successfully prevents dragging and resizing on the canvas, the coordinate inputs (Left, Top, Width, Height) in the **Layers Manager** settings form remain editable. A user can still move or resize a locked layer by typing numbers or clicking input arrows.
*   **Fix**: Update `renderLayerSettingsForm` in `js/ui/layers-editor.js` to set `disabled = true` on geometry and text fields if `layer.locked` is `true`.

### 2. Native `confirm()` Blocks Main Thread
*   **Problem**: Clicking the delete button (`🗑`) triggers a native browser `confirm()` modal. This looks unpolished, blocks the main UI thread, and interferes with headless testing or automated subagents.
*   **Fix**: Create a custom HTML/Tailwind CSS confirm modal that is styled to match the dark cyber-theme and is non-blocking.

### 3. State Desynchronization Between Standard & Advanced Editors
*   **Problem**: Adding, deleting, or renaming layers in Advanced Mode is not fully reflected in the **Standard Editor** inputs since the standard mode relies on hardcoded input IDs for default layers.
*   **Fix**: Disable standard mode tabs or dynamically map standard controls based on remaining default layers to avoid JS references to deleted layers.

### 4. Preset Colors Not Applied on Load
*   **Problem**: When loading a preset (e.g., Tzadik English), the brand color hex inputs are updated in the sidebar, but the canvas background and SVG elements do not update visually (the colors of the previous state remain).
*   **Fix**: Call `updateColors()` at the end of `loadPresetState()` in `js/presets-db.js`.

### 5. Initial Preset Dropdown Mismatch
*   **Problem**: On page load, the default poster text and language are English, but the preset select menu at the top defaults to displaying "ערכה מובנית: tzadik עברית" (Tzadik Hebrew).
*   **Fix**: Pass `"built-in:tzadik-en"` as the default selection value when calling `populatePresetDropdown()` during initialization in `app.js`.

### 6. Left and Right Callout Bubbles Overlap
*   **Problem**: In the default template coordinates, the Left Callout (`layer_callout_left`) and the Logo (`layer_logo_1`) are both positioned at `{ left: 32, top: 32 }`. When entering Advanced Mode, they jump and overlap.
*   **Fix**: Update default template coordinates to prevent overlaps, or dynamically copy standard-mode positions into layer positions when entering Advanced Mode.

### 7. Delete Button Inoperative in Layers Manager
*   **Problem**: Clicking the delete button (`🗑`) in Layer Mode is reported as not removing custom layers.
*   **Fix**: Audit the `deleteLayer` implementation, check event propagation on the SVG buttons, and ensure proper state refresh.

---

## 🎨 UI/UX & Interaction Enhancements

### 1. Snapping Guide Line Styling
*   **Problem**: Snapping guides for half-page, quarter-page, and elements are all rendered as the same solid pink line.
*   **Fix**: Differentiate snapping guides by styling them based on the snap source (e.g., purple solid line for half-page center, cyan dashed line for quarter-page centers, and pink dotted line for layer blocks).

### 2. Sidebar Auto-Scroll on Canvas Selection
*   **Problem**: Clicking a layer directly on the poster canvas highlights it in the **Layers Manager** sidebar list. However, if the layer list is long and scrolled out of view, the user won't see which layer item is selected.
*   **Fix**: Add `row.scrollIntoView({ behavior: 'smooth', block: 'nearest' })` in `selectLayer` in `js/ui/layers-list.js`.

### 3. No Canvas Boundary Indicator
*   **Problem**: Elements cannot be dragged outside the boundaries of the A4 canvas (0-595px width, 0-842px height). However, when dragging stops at the edge, there is no visual feedback to indicate the boundary has been hit.
*   **Fix**: Flash the outline of the dragged element red, or add a red border highlight to the poster container when an element is clamped to the edge during drag.

### 4. Separate F5 Presets from Standard Built-ins
*   **Problem**: Corporate F5 presets are mixed together with standard general built-in presets (Tzadik/Original) in the dropdown list.
*   **Fix**: Group the preset dropdown options or hide/restrict the F5 presets so they are not shown alongside standard ones by default.

### 5. Undo/Redo History Stack (Missing Feature)
*   **Problem**: Accidental edits, drags, resizes, duplicates, or deletions cannot be undone, requiring a full preset reload or manual correction.
*   **Fix**: Implement an history stack (maximum 20 states) in `js/state.js` that pushes the state of `layers` after drag-end, resize-end, or configuration changes. Bind to `Ctrl+Z` / `Ctrl+Y`.

### 6. RTL Screen Layout Alignment
*   **Problem**: The application is translated between Hebrew and English, but the main dashboard layout remains fixed (sidebar is always on the left, canvas on the right). A true RTL layout should flip the sidebar to the right side of the screen.
*   **Fix**: Dynamically toggle Tailwind classes like `flex-row-reverse` on the main container when switching between `he` and `en` modes.

### 7. Local `file://` CORS Portability
*   **Problem**: If opening the HTML file directly on a phone/PC using `file://` without a local server, browsers block loading preset files and images via HTTP requests due to security protocols.
*   **Fix**: Ensure local fallback mechanisms are in place or display a clear user message advising them to run a simple server (e.g. `npx http-server` or Python's server) for full functionality.

---

## 🚀 Future Roadmap & Upgrades

### 1. Dynamic Standard Mode Controls (Advanced Layers Edit)
*   **Specification**: Custom text blocks and logos added in Advanced Mode should appear dynamically in Standard Mode as editable form fields. The order of these fields in the sidebar should automatically match their vertical positions (top-to-bottom) on the canvas.

