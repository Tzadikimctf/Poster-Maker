// Dynamic Background squigglies styles
const BACKGROUND_STYLES = {
    curves: {
        topLeftD: "M0 0H290C290 0 310 90 275 160C240 220 145 200 0 200V0Z",
        midRightD: "M595 180C510 180 440 250 440 360C440 470 520 500 595 520V180Z",
        bottomRightD: "M595 520C470 520 370 620 370 730C370 780 395 815 425 842H595V520Z"
    },
    geometric: {
        topLeftD: "M0 0H310L230 180H0V0Z",
        midRightD: "M595 160L460 260L595 530V160Z",
        bottomRightD: "M595 480L380 720L500 842H595V480Z"
    },
    waves: {
        topLeftD: "M0 0H260C260 0 340 50 250 120C160 190 220 220 0 220V0Z",
        midRightD: "M595 150C530 150 420 200 460 320C500 440 510 450 595 490V150Z",
        bottomRightD: "M595 470C430 470 390 550 400 680C410 810 510 820 595 842V470Z"
    },
    cyber: {
        topLeftD: "M0 0H280L210 70H140L70 140H0V0Z",
        midRightD: "M595 180H520L460 240V340L500 380H595V180Z",
        bottomRightD: "M595 520H480L380 620V730L490 842H595V520Z"
    },
    minimalist: {
        topLeftD: "M0 0H120L0 120V0Z",
        midRightD: "M595 320L540 360L595 400V320Z",
        bottomRightD: "M595 720L490 842H595V720Z"
    },
    diagonal: {
        topLeftD: "M0 0H350L0 350V0Z",
        midRightD: "M595 240L420 415L595 590V240Z",
        bottomRightD: "M595 590L342 842H595V590Z"
    },
    techno: {
        topLeftD: "M0 0H260L310 50L260 100H100L0 200V0Z",
        midRightD: "M595 180H500L450 230V330L500 380H595V180Z",
        bottomRightD: "M595 520H480L380 620V730L492 842H595V520Z"
    },
    stripes: {
        topLeftD: "M0 0H240L160 80H80L0 160V0Z",
        midRightD: "M595 140L500 235L595 330V140ZM595 380L500 475L595 570V380Z",
        bottomRightD: "M595 620L373 842H485L595 732V620Z"
    }
};

// Preset Colors & Theme Data
const THEMES = {
    tzadik: {
        primary: '#004124',    // Deep Pine Green
        secondary: '#71CCE7',  // Logo Cyber Sky Blue
        textDark: '#0f2219',   // Very dark green for light areas
        textLight: '#000000'   // Black for deep areas
    },
    original: {
        primary: '#091e36',    // Deep Dark Navy
        secondary: '#00b0ff',  // Bright Cyan
        textDark: '#081c33',   // Deep dark navy
        textLight: '#000000'   // Black for deep areas
    }
};

// Initial default poster configuration (Generic default speaker - No Yair)
const DEFAULTS = {
    calloutLeft: 'Or just learn how hackers think and operate',
    calloutRight: 'Come acquire knowledge that could be relevant to your career!',
    title1: 'Introduction to Cyber:',
    title2: 'From Viruses to Careers',
    date: 'Thursday, 25.12.2025',
    time: '14:00-15:00',
    location: 'Building 503 (CS) Room 226',
    speakerName: 'Speaker Name',
    speakerRole: "Speaker's Role / Company",
    theme: 'tzadik',
    bgStyle: 'curves',
    cyberOverlay: 'none',
    logoVisible: true,
    logoBg: false,
    logoPosition: 'top-left',
    logoSize: 95,
    avatarZoom: 440,
    avatarX: -154,
    avatarY: -386,
    speakerImgSrc: 'https://placehold.co/300x300/004124/71CCE7?text=Speaker',
    logoImgSrc: 'Biu_tzadik_nobackground.png',
    fzTitle: 36,
    fzCallouts: 15,
    fzDetails: 19,
    fzSpeaker: 22,
    verticalShift: 0,
    primaryColor: '#004124',
    secondaryColor: '#71CCE7',
    textDarkColor: '#0f2219',
    textLightColor: '#000000',
    layoutDirection: 'ltr',
    uiLanguage: 'en'
};

// Translation Dictionary for English and Hebrew interface
const UI_TRANSLATIONS = {
    he: {
        "app-title": "מחולל כרזות סייבר אינטראקטיבי",
        "app-subtitle": "התאמה אישית של כרזת הסייבר עם מנגנון מניעת חריגת טקסט",
        "btn-reset-defaults": "איפוס לברירת מחדל",
        "btn-print": "הדפסה / שמירה כ-PDF",
        "btn-download-png": "הורדה כתמונה (PNG)",
        "tab-content": "תוכן וטקסטים",
        "tab-design": "עיצוב ומידות גופן",
        "tab-images": "תמונות ומיקום",
        "tab-presets": "ערכות שמורות",
        
        // Tab Content
        "sec-callouts": "קריאות עליונות לפעולה",
        "lbl-callout-left": "בלון שמאלי (רקע בהיר):",
        "lbl-callout-right": "בלון ימני (רקע כהה):",
        "sec-title": "כותרת ההרצאה",
        "lbl-title-1": "שורת כותרת 1:",
        "lbl-title-2": "שורת כותרת 2:",
        "sec-details": "פרטי אירוע ומיקום",
        "lbl-date": "תאריך ויום:",
        "lbl-time": "שעות פעילות:",
        "lbl-location": "מיקום וחדר:",
        "sec-speaker": "פרטי המרצה",
        "lbl-speaker-name": "שם המרצה:",
        "lbl-speaker-role": "תפקיד / חברה:",

        // Tab Design
        "sec-overflow": "בקרת מניעת חריגת טקסט (מניעת קטיעה)",
        "desc-overflow": "השתמש בסליידרים הבאים כדי להקטין/להגדיל את הגופנים ולמנוע כפילויות או קטיעות בכרזה.",
        "lbl-fz-title-slider": "גודל גופן כותרת ראשית:",
        "lbl-fz-callouts-slider": "גודל גופן בלוני קריאה (עליון):",
        "lbl-fz-details-slider": "גודל גופן פרטי אירוע (אמצע):",
        "lbl-fz-speaker-slider": "גודל גופן פרטי מרצה:",
        "lbl-vertical-shift-slider": "מיקום כותרות ופרטים (אנכי):",
        "sec-bg-style": "סגנון גרפיקת רקע (צורות)",
        "btn-style-curves": "סגנון גלים מקורי",
        "btn-style-geometric": "סגנון גיאומטרי חד",
        "btn-style-waves": "סגנון גלים זורמים",
        "btn-style-minimalist": "סגנון מינימליסטי",
        "btn-style-diagonal": "סגנון אלכסוני",
        "btn-style-techno": "סגנון טכנולוגי",
        "btn-style-stripes": "סגנון פסים",
        "btn-style-cyber": "סגנון מעגלי סייבר ורשת (Cyber Tech)",
        "sec-cyber-overlay": "גרפיקה נושאית של סייבר (Overlays)",
        "desc-cyber-overlay": "בחר שכבת ציורים או נתוני סייבר שיצטרפו לרקע הכרזה.",
        "opt-overlay-none": "ללא גרפיקה (None)",
        "opt-overlay-networks": "רשתות תקשורת (Networks)",
        "opt-overlay-electronics": "מעגלים אלקטרוניים (Electronics / Circuit Board)",
        "opt-overlay-reversing": "הנדסה לאחור (Reverse Engineering Assembly)",
        "opt-overlay-exploit": "ניצול פגיעויות (Binary Exploitation Stack)",
        "sec-presets-color": "ערכות צבעים מוכנות",
        "btn-preset-tzadik": "לוגו צדיק (ירוק-תכלת)",
        "btn-preset-original": "המקור (כחול-תכלת)",
        "sec-custom-colors": "התאמת צבעים אישית",
        "lbl-primary-color": "צבע ראשי (כהה):",
        "lbl-secondary-color": "צבע משני (בהיר):",
        "lbl-text-dark": "טקסט על רקע כהה:",
        "lbl-text-light": "טקסט על רקע בהיר:",
        "sec-font-family": "סגנון גופן",
        "opt-font-secular": "Secular One (דומיננטי ורחב)",
        "opt-font-varela": "Varela Round (מעוגל ונקי)",
        "opt-font-rubik": "Rubik (מודרני וטכנולוגי)",

        // Tab Images
        "sec-logo-pos": "מיקום לוגו המותג",
        "lbl-show-logo": "הצגת לוגו:",
        "lbl-logo-bg": "רקע לבן ללוגו:",
        "lbl-logo-position": "מיקום לוגו:",
        "btn-logo-tl": "שמאל למעלה",
        "btn-logo-tr": "ימין למעלה",
        "btn-logo-bl": "שמאל למטה",
        "lbl-logo-size": "גודל לוגו (פיקסלים):",
        "lbl-upload-logo": "העלאת לוגו מותג חלופי:",
        "sec-speaker-image": "התאמת תמונת מרצה",
        "desc-speaker-image": "משוך והזז את הסליידרים כדי למרכז בצורה מושלמת את פני המרצה מתוך כרזת המקור.",
        "lbl-upload-speaker": "העלאת תמונת מרצה מותאמת אישית:",
        "btn-restore-speaker": "חזרה לתמונת מקור מעובדת",
        "lbl-speaker-zoom": "זום תמונה (%):",
        "lbl-speaker-x": "מיקום אופקי (X):",
        "lbl-speaker-y": "מיקום אנכי (Y):",
        "btn-sidebar-reset": "חזרה להגדרות ברירת מחדל (איפוס)",

        // Tab Presets
        "sec-presets-mgmt": "ניהול ערכות עיצוב (Presets)",
        "lbl-active-preset": "בחירת ערכה פעילה:",
        "lbl-load-json": "טעינה מקובץ JSON:",
        "btn-export-json": "ייצוא כקובץ JSON",
        "sec-save-memory": "שמירת ערכה מהירה לזיכרון (In-Memory)",
        "lbl-preset-name": "שם הערכה החדשה:",
        "btn-save-memory": "שמור לזיכרון",
        "sec-ui-language": "שפת ממשק העורך (UI Language)",
        "lbl-ui-lang": "בחר שפת ממשק:"
    },
    en: {
        "app-title": "Interactive Cyber Poster Generator",
        "app-subtitle": "Customize your cyber poster with text-overflow prevention",
        "btn-reset-defaults": "Reset to Defaults",
        "btn-print": "Print / Save as PDF",
        "btn-download-png": "Download as Image (PNG)",
        "tab-content": "Content & Texts",
        "tab-design": "Design & Fonts",
        "tab-images": "Images & Alignment",
        "tab-presets": "Saved Presets",
        
        // Tab Content
        "sec-callouts": "Top Callouts to Action",
        "lbl-callout-left": "Left Bubble (Light Background):",
        "lbl-callout-right": "Right Bubble (Dark Background):",
        "sec-title": "Lecture Title",
        "lbl-title-1": "Title Line 1:",
        "lbl-title-2": "Title Line 2:",
        "sec-details": "Event Details & Location",
        "lbl-date": "Day and Date:",
        "lbl-time": "Event Hours:",
        "lbl-location": "Location & Room:",
        "sec-speaker": "Speaker Details",
        "lbl-speaker-name": "Speaker's Name:",
        "lbl-speaker-role": "Role / Company:",

        // Tab Design
        "sec-overflow": "Text Overflow Prevention (Anti-Clipping)",
        "desc-overflow": "Use the following sliders to scale fonts and prevent overlaps or text clipping on the poster.",
        "lbl-fz-title-slider": "Main Title Font Size:",
        "lbl-fz-callouts-slider": "Callout Bubbles Font Size:",
        "lbl-fz-details-slider": "Event Details Font Size:",
        "lbl-fz-speaker-slider": "Speaker Info Font Size:",
        "lbl-vertical-shift-slider": "Vertical Alignment Shift:",
        "sec-bg-style": "Background Graphic Style (Shapes)",
        "btn-style-curves": "Original Waves Style",
        "btn-style-geometric": "Sharp Geometric Style",
        "btn-style-waves": "Flowing Waves Style",
        "btn-style-minimalist": "Minimalist Style",
        "btn-style-diagonal": "Diagonal Style",
        "btn-style-techno": "Techno Style",
        "btn-style-stripes": "Stripes Style",
        "btn-style-cyber": "Cyber Circuit & Networks Style",
        "sec-cyber-overlay": "Thematic Cyber Graphics (Overlays)",
        "desc-cyber-overlay": "Select a layer of cyber illustrations to add to the poster background.",
        "opt-overlay-none": "No graphics (None)",
        "opt-overlay-networks": "Communications Networks (Networks)",
        "opt-overlay-electronics": "Electronic Circuits (Electronics)",
        "opt-overlay-reversing": "Reverse Engineering Assembly (Reversing)",
        "opt-overlay-exploit": "Vulnerability Exploitation Stack (Exploits)",
        "sec-presets-color": "Ready-made Color Themes",
        "btn-preset-tzadik": "Tzadik Logo (Green-Cyan)",
        "btn-preset-original": "Original (Blue-Cyan)",
        "sec-custom-colors": "Custom Color Adjustment",
        "lbl-primary-color": "Primary Color (Dark):",
        "lbl-secondary-color": "Secondary Color (Light):",
        "lbl-text-dark": "Text on Dark Background:",
        "lbl-text-light": "Text on Light Background:",
        "sec-font-family": "Font Family Style",
        "opt-font-secular": "Secular One (Dominant & Wide)",
        "opt-font-varela": "Varela Round (Rounded & Clean)",
        "opt-font-rubik": "Rubik (Modern & Technological)",

        // Tab Images
        "sec-logo-pos": "Brand Logo Placement",
        "lbl-show-logo": "Show Logo:",
        "lbl-logo-bg": "White Background for Logo:",
        "lbl-logo-position": "Logo Position:",
        "btn-logo-tl": "Top Left",
        "btn-logo-tr": "Top Right",
        "btn-logo-bl": "Bottom Left",
        "lbl-logo-size": "Logo Size (pixels):",
        "lbl-upload-logo": "Upload Alternative Logo:",
        "sec-speaker-image": "Speaker Image Tuning",
        "desc-speaker-image": "Drag and adjust coordinates to perfectly center the speaker's face from the original image.",
        "lbl-upload-speaker": "Upload Custom Speaker Image:",
        "btn-restore-speaker": "Reset to Processed Original",
        "lbl-speaker-zoom": "Image Zoom (%):",
        "lbl-speaker-x": "Horizontal Position (X):",
        "lbl-speaker-y": "Vertical Position (Y):",
        "btn-sidebar-reset": "Reset All to Defaults",

        // Tab Presets
        "sec-presets-mgmt": "Design Presets Management",
        "lbl-active-preset": "Select Active Preset:",
        "lbl-load-json": "Load from JSON File:",
        "btn-export-json": "Export Current to JSON",
        "sec-save-memory": "Quick Save to Browser Memory",
        "lbl-preset-name": "New Preset Name:",
        "btn-save-memory": "Save to Memory",
        "sec-ui-language": "Interface Language (UI Language)",
        "lbl-ui-lang": "Select UI Language:"
    }
};
