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
        if (typeof captureSimpleModePositions === 'function') {
            captureSimpleModePositions();
        }
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
