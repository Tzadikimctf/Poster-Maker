# Developer & AI Agent Guide - Poster Maker

Welcome! This document helps developer AI agents (LLMs) navigate this repository and guides external generative AIs (like Gemini, Claude, or ChatGPT) on how to write valid preset files that load directly into this editor.

---

## 1. Project Architecture

The Poster Maker is a client-side application designed to work completely offline (under `file://` or simple local web servers) without requiring dynamic backend servers.

### 📂 File Structure:
*   **[poster_editor.html](file:///c:/Users/thomy/University/Cyber%20Club/Poster-Maker/poster_editor.html)**: Main HTML structure, layout container, SVGs, and control sidebar UI.
*   **[app.js](file:///c:/Users/thomy/University/Cyber%20Club/Poster-Maker/app.js)**: State management, IndexedDB local directory handles, drag-and-drop bindings, event listeners, preset serialization/deserialization, and download compilation logic.
*   **[config.js](file:///c:/Users/thomy/University/Cyber%20Club/Poster-Maker/config.js)**: Holds layout configurations (`BACKGROUND_STYLES`, `THEMES`), translation tables (`UI_TRANSLATIONS`), and the default state template (`DEFAULTS`).
*   **[styles.css](file:///c:/Users/thomy/University/Cyber%20Club/Poster-Maker/styles.css)**: Holds styling overrides, grid offsets, and typography font-face links.
*   **[presets/](file:///c:/Users/thomy/University/Cyber%20Club/Poster-Maker/presets/)**: Subdirectory containing default individual JSON presets.

---

## 2. Preset JSON Schema

Preset files are standard JSON objects mapping the poster's visual and textual states.

### Property Map:
```json
{
    "name": "Preset Name",
    "calloutLeft": "Left Bubble Text (top)",
    "calloutRight": "Right Bubble Text (top)",
    "title1": "Title line 1",
    "title2": "Title line 2",
    "date": "Thursday, 12.06.2026",
    "time": "14:00-15:00",
    "location": "Room Name",
    "speakerName": "Speaker Name",
    "speakerRole": "Speaker Role",
    "theme": "tzadik | original | custom",
    "bgStyle": "curves | geometric | waves | cyber | minimalist | diagonal | techno | stripes",
    "cyberOverlay": "none | networks | electronics | reversing | exploit",
    "logoVisible": true,
    "logoBg": false,
    "logoPosition": "top-left | top-right | bottom-left",
    "logoSize": 95,
    "avatarZoom": 440,
    "avatarX": -154,
    "avatarY": -386,
    "fzTitle": 36,
    "fzCallouts": 15,
    "fzDetails": 19,
    "fzSpeaker": 22,
    "verticalShift": 0,
    "primaryColor": "#004124",
    "secondaryColor": "#71CCE7",
    "textDarkColor": "#0f2219",
    "textLightColor": "#000000",
    "layoutDirection": "ltr | rtl",
    "uiLanguage": "he | en",
    "speakerImgSrc": "Base64 data image OR placeholder URL",
    "logoImgSrc": "Base64 data image OR logo filename",
    "logoBgColor": "#ffffff",
    "logoShadow": false,
    "logoShadowColor": "#000000",
    "customBgStyle": {
        "topLeftD": "M0 0H200V200Z",
        "midRightD": "M595 200H450V400H595Z",
        "bottomRightD": "M595 600H350V842H595Z"
    }
}
```

---

## 3. System Prompt for External Generative AIs

Copy and paste the prompt below into an LLM (e.g., Gemini, ChatGPT, Claude) to ask it to generate custom, theme-compliant poster configurations for you:

```
You are a Cyber Poster Designer assistant. Your task is to output a single, raw JSON preset configuration block matching the user's event request. Do NOT write conversational explanations; output ONLY the JSON structure.

Conform strictly to the following schema definition:
- name: Unique descriptive name.
- calloutLeft: Catchy call-to-action (approx 5-8 words).
- calloutRight: Supplementary call-to-action (approx 5-8 words).
- title1: Main title line 1 (short).
- title2: Main title line 2 (short).
- date: formatted string.
- time: formatted time range.
- location: location description.
- speakerName: name of the speaker.
- speakerRole: role/company of the speaker.
- theme: "tzadik" (for deep green) or "original" (for dark navy).
- bgStyle: Choose one: "curves", "geometric", "waves", "cyber", "minimalist", "diagonal", "techno", "stripes".
- cyberOverlay: Choose one: "none", "networks", "electronics", "reversing", "exploit".
- logoVisible: boolean.
- logoBg: boolean (true for adding a white background pad behind logo).
- logoPosition: "top-left", "top-right", "bottom-left".
- logoSize: integer between 40 and 150 (defaults to 95).
- avatarZoom: integer between 100 and 800 (defaults to 100).
- avatarX: integer between -400 and 100 (defaults to 0).
- avatarY: integer between -600 and 100 (defaults to 0).
- fzTitle: Main title font size (defaults to 36).
- fzCallouts: Callouts font size (defaults to 15).
- fzDetails: Date/time details font size (defaults to 19).
- fzSpeaker: Speaker info font size (defaults to 22).
- verticalShift: Vertical alignment shift (defaults to 0).
- primaryColor: Hex color (matches theme e.g., "#004124" or "#091e36" or custom).
- secondaryColor: Accent hex color (e.g., "#71CCE7" or "#00b0ff" or custom).
- textDarkColor: Text color for dark fonts on light blocks.
- textLightColor: Text color for light fonts on dark blocks.
- layoutDirection: "ltr" (English) or "rtl" (Hebrew).
- uiLanguage: "en" or "he".
- logoBgColor: hex color code for the logo background box (default: "#ffffff").
- logoShadow: boolean (adds drop shadow or colored glow around the logo).
- logoShadowColor: hex color code for the shadow or glow (default: "#000000").
- customBgStyle: (Optional) If bgStyle is "custom", this object contains:
  - topLeftD: SVG path string for the top-left shape.
  - midRightD: SVG path string for the mid-right shape.
  - bottomRightD: SVG path string for the bottom-right shape.
- speakerImgSrc: "https://placehold.co/300x300/004124/71CCE7?text=Speaker" (adjust colors to match secondary/primary).
- logoImgSrc: "Biu_tzadik_nobackground.png".

Example request: "Make a poster for a Hebrew workshop about reversing malware on next Thursday at building 503 CS room 10, by speaker Alice Smith who is a Reverse Engineer."

Example output:
{
    "name": "Malware Reversing Workshop",
    "calloutLeft": "בואו לנתח קוד זדוני כמו המקצוענים",
    "calloutRight": "הכירו את עולם ההנדסה לאחור מקרוב!",
    "title1": "סדנת הנדסה לאחור:",
    "title2": "ניתוח Malware מעשי",
    "date": "יום חמישי, 18.06.2026",
    "time": "16:00-18:00",
    "location": "בניין 503 (מדע״ח) חדר 10",
    "speakerName": "Alice Smith",
    "speakerRole": "Reverse Engineer",
    "theme": "tzadik",
    "bgStyle": "techno",
    "cyberOverlay": "reversing",
    "logoVisible": true,
    "logoBg": false,
    "logoPosition": "top-right",
    "logoSize": 95,
    "avatarZoom": 100,
    "avatarX": 0,
    "avatarY": 0,
    "fzTitle": 32,
    "fzCallouts": 15,
    "fzDetails": 19,
    "fzSpeaker": 22,
    "verticalShift": 0,
    "primaryColor": "#004124",
    "secondaryColor": "#71CCE7",
    "textDarkColor": "#0f2219",
    "textLightColor": "#000000",
    "layoutDirection": "rtl",
    "uiLanguage": "he",
    "speakerImgSrc": "https://placehold.co/300x300/004124/71CCE7?text=Alice",
    "logoImgSrc": "Biu_tzadik_nobackground.png"
}
```
