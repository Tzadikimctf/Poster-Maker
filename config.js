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

// Initial default poster configuration
const DEFAULTS = {
    calloutLeft: 'או סתם ללמוד איך האקרים חושבים ופועלים',
    calloutRight: 'בואו לרכוש ידע שיכול להיות רלוונטי לקריירה שלכם!',
    title1: 'מבוא לסייבר:',
    title2: 'וירוסים ועד קריירות',
    date: 'יום חמישי, 25.12.2025',
    time: '14:00-15:00',
    location: 'בניין 503 (מדע״ח) חדר 226',
    speakerName: 'יאיר אולמייב',
    speakerRole: 'Senior Security Researcher @ CYE',
    theme: 'tzadik',
    bgStyle: 'curves',
    cyberOverlay: 'none',
    logoVisible: true,
    logoBg: false,
    logoPosition: 'top-right',
    logoSize: 95,
    avatarZoom: 440,
    avatarX: -154,
    avatarY: -386,
    speakerImgSrc: 'image_6ca388.jpg',
    logoImgSrc: 'Biu_tzadik_nobackground.png',
    fzTitle: 36,
    fzCallouts: 15,
    fzDetails: 19,
    fzSpeaker: 22,
    verticalShift: 0
};
