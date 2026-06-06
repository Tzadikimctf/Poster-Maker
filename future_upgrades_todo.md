# Roadmap & Future Upgrades - Poster & CV Engine

This document details the explicit specifications and roadmap for future upgrades. It covers enhancements to the existing Poster Generator and outlines the transition plan to a document-flow-based CV Maker.

---

## Phase 1: Poster Editor Modularity Upgrades
Enhance the existing poster engine to be fully modular, interactive, and robust.

### 1. Full Modular Custom Fields Schema
- `[ ]` **Dynamic Schema Definition:**
  - `[ ]` Define custom layer templates in `config.js` or presets (e.g. text layers, images, decorative shapes).
  - `[ ]` Allow layers to declare custom meta-properties (e.g. line height, character limits, visibility rules).
- `[ ]` **Dynamic UI Builder:**
  - `[ ]` Refactor `renderLayerSettingsForm` in `js/ui.js` to automatically parse a layer's properties and generate corresponding input controls (sliders, select menus, color pickers, textareas) instead of using hardcoded element checkers.
- `[x]` **Preset Serialization & Load:** *(Already implemented)*
  - `[x]` `getCurrentStateAsPreset()` deep-copies the full `layers` array including custom layers.
  - `[x]` `loadPresetState()` restores the complete layers array from preset JSON (line 102-103 in `presets-db.js`).
  - `[x]` Export/import via JSON file works with `exportCurrentPreset()` and `handlePresetFileUpload()`.

### 2. UI/UX & Interaction Upgrades
- `[x]` **Sidebar-Canvas Syncing:** *(Implemented)*
  - `[x]` Checkbox `onchange` now calls `setSidebarMode(this.checked ? 'advanced' : 'standard')` in `poster_editor.html:225`.
  - `[x]` Toggling the checkbox auto-switches the sidebar panel. Clicking sidebar tabs also syncs the checkbox.
- `[x]` **Interactive Layer Tree Controls:** *(Implemented)*
  - `[x]` Lock/Unlock toggle on each layer row — prevents drag & resize when locked. Amber outline on canvas for locked+selected layers.
  - `[x]` Visibility checkbox already existed — now also applies strikethrough on hidden layer names.
  - `[x]` Duplicate button deep-copies any layer with offset position and unique ID.
  - `[x]` Delete button for custom layers was already present.
  - `[x]` Lock enforcement in `drag-drop.js`: `initResize()` and `startDrag()` both check `layer.locked`.
- `[ ]` **Undo / Redo Stack:**
  - `[ ]` Implement a state tracking stack in `js/state.js` that pushes snapshots of the active `layers` array on drag-end, resize-end, or configuration changes.
  - `[ ]` Add `Ctrl+Z` / `Ctrl+Y` shortcuts and matching header buttons.

---

## Phase 2: CV / Resume Engine Transition
Leverage and adapt the poster editor engine to render paginated, flow-based, ATS-optimized CVs.

### 1. Flow Layout & Relative Shifting Engine
- `[ ]` **Vertical Flow Stack:**
  - `[ ]` Replace absolute position logic with a flowing layout structure where elements stack vertically.
  - `[ ]` Implement dynamic bounding-box calculations: if "Experience #1" grows in height, calculate its new bottom boundary and automatically push all elements below it down by the offset delta.
- `[ ]` **Column & Sidebar Grids:**
  - `[ ]` Support multi-column layouts (e.g., a left sidebar at 30% width for contact/skills, and a main column at 70% width for professional experience).

### 2. Repeating List Components (CV-Specific Schema)
- `[ ]` **Dynamic List Rows:**
  - `[ ]` Upgrade the schema to support nested arrays of items within a section (e.g., a list of jobs within an "Experience" section).
  - `[ ]` Add inline editor buttons (`+ Add Entry`, `- Remove Entry`, `▲ Move Up`, `▼ Move Down`) inside the UI to let users manage their career chronology.

### 3. Multi-Page Document Management
- `[ ]` **Automatic Page Breaks:**
  - `[ ]` Set page height boundary to standard A4 (297mm or 842px).
  - `[ ]` Calculate when a flowing layout exceeds the height of the current page and automatically create a new page container.
  - `[ ]` Push overflowing text blocks cleanly onto the next page to prevent text splitting/clipping in the middle of a line.
- `[ ]` **Header & Footer Templating:**
  - `[ ]` Replicate contact details (header) or page numbers (footer) on page 2 and beyond.

### 4. ATS & Print Optimization
- `[ ]` **Text Selectability & ATS Friendliness:**
  - `[ ]` Render all text as standard HTML elements (not canvas/SVGs) so Applicant Tracking Systems can easily extract the plain text.
  - `[ ]` Use system fonts (Arial, Times New Roman, Calibri, Georgia) as primary options for high-compatibility parsing.
- `[ ]` **High-Res PDF Print Output:**
  - `[ ]` Configure print stylesheets to hide editor sidebars, crop page boundaries cleanly at A4 sheets, and output high-res selectable vector documents.
