// Export poster to PNG File
function downloadPNG() {
    const poster = document.getElementById('cyber-poster');
    const scaleWrapper = document.getElementById('poster-scale-wrapper');

    // Show processing alert message box rather than alert()
    const msgBox = document.createElement('div');
    msgBox.className = "fixed inset-0 bg-black/75 z-50 flex items-center justify-center text-white text-lg font-semibold dir-rtl no-print";
    msgBox.innerHTML = `
        <div class="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-4 max-w-sm text-center">
            <svg class="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span data-i18n="png-msg">מייצר קובץ תמונה באיכות גבוהה... נא להמתין</span>
        </div>
    `;
    document.body.appendChild(msgBox);

    // Swap text for high-DPI message if English
    if (currentLanguage === 'en') {
        msgBox.querySelector('span').textContent = "Generating high-quality image file... Please wait";
    }

    // Temporarily remove scale transform so html2canvas captures at true 595x842 size
    const savedTransform = scaleWrapper ? scaleWrapper.style.transform : '';
    const savedOrigin = scaleWrapper ? scaleWrapper.style.transformOrigin : '';
    if (scaleWrapper) {
        scaleWrapper.style.transform = 'none';
        scaleWrapper.style.transformOrigin = '';
    }

    // Remove rounded corners and border for clean export
    const savedBorderRadius = poster.style.borderRadius;
    const savedBorder = poster.style.border;
    poster.style.borderRadius = '0';
    poster.style.border = 'none';
    poster.classList.remove('rounded-2xl');

    // Use html2canvas to capture vector details correctly
    const primaryColor = document.getElementById('color-primary').value || '#004124';
    html2canvas(poster, {
        width: 595,
        height: 842,
        scale: 2.5, // Enhances print DPI density
        useCORS: true,
        allowTaint: true,
        backgroundColor: primaryColor
    }).then(canvas => {
        const speakerLayer = layers.find(l => l.id === 'layer_speaker_name');
        const speakerName = (speakerLayer && speakerLayer.text) ? speakerLayer.text : 'Speaker';
        const link = document.createElement('a');
        link.download = `Cyber_Poster_${speakerName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        msgBox.remove();
    }).catch(err => {
        msgBox.remove();
        console.error("PNG export error:", err);
    }).finally(() => {
        // Restore scale transform and styling
        if (scaleWrapper) {
            scaleWrapper.style.transform = savedTransform;
            scaleWrapper.style.transformOrigin = savedOrigin;
        }
        poster.style.borderRadius = savedBorderRadius;
        poster.style.border = savedBorder;
        poster.classList.add('rounded-2xl');
        adjustPosterScale();
    });
}

// Printer & Native PDF Exporter
function printPoster() {
    const poster = document.getElementById('cyber-poster');
    const scaleWrapper = document.getElementById('poster-scale-wrapper');

    // Show processing alert message box
    const msgBox = document.createElement('div');
    msgBox.className = "fixed inset-0 bg-black/75 z-50 flex items-center justify-center text-white text-lg font-semibold dir-rtl no-print";
    msgBox.innerHTML = `
        <div class="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-4 max-w-sm text-center">
            <svg class="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span data-i18n="pdf-msg">מייצר קובץ PDF להורדה... נא להמתין</span>
        </div>
    `;
    document.body.appendChild(msgBox);

    if (currentLanguage === 'en') {
        msgBox.querySelector('span').textContent = "Generating PDF file download... Please wait";
    }

    // Temporarily remove scale transform so html2canvas captures at true 595x842 size
    const savedTransform = scaleWrapper ? scaleWrapper.style.transform : '';
    const savedOrigin = scaleWrapper ? scaleWrapper.style.transformOrigin : '';
    if (scaleWrapper) {
        scaleWrapper.style.transform = 'none';
        scaleWrapper.style.transformOrigin = '';
    }

    // Remove rounded corners and border for clean export
    const savedBorderRadius = poster.style.borderRadius;
    const savedBorder = poster.style.border;
    poster.style.borderRadius = '0';
    poster.style.border = 'none';
    poster.classList.remove('rounded-2xl');

    // Run html2canvas to capture details correctly
    const primaryColor = document.getElementById('color-primary').value || '#004124';
    html2canvas(poster, {
        width: 595,
        height: 842,
        scale: 2.5, // High quality A4 DPI
        useCORS: true,
        allowTaint: true,
        backgroundColor: primaryColor
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // Use jsPDF to generate the document
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // A4 page is exactly 210mm x 297mm
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        const speakerLayer = layers.find(l => l.id === 'layer_speaker_name');
        const speakerName = (speakerLayer && speakerLayer.text) ? speakerLayer.text : 'Speaker';
        const fileName = `Cyber_Poster_${speakerName.replace(/\s+/g, '_')}.pdf`;
        pdf.save(fileName);
        msgBox.remove();
    }).catch(err => {
        msgBox.remove();
        console.error("PDF export error:", err);
        alert(currentLanguage === 'he' ? "שגיאה בייצוא PDF: " + err.message : "Error exporting PDF: " + err.message);
    }).finally(() => {
        // Restore scale transform and styling
        if (scaleWrapper) {
            scaleWrapper.style.transform = savedTransform;
            scaleWrapper.style.transformOrigin = savedOrigin;
        }
        poster.style.borderRadius = savedBorderRadius;
        poster.style.border = savedBorder;
        poster.classList.add('rounded-2xl');
        adjustPosterScale();
    });
}
