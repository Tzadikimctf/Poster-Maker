const assert = require('assert');

// Mock simple DOM elements and functions to test parsing and cleaning logic
global.document = {
    elements: {},
    getElementById(id) {
        if (!this.elements[id]) {
            this.elements[id] = {
                value: '',
                innerText: '',
                checked: false,
                style: {},
                classList: {
                    add: () => {},
                    remove: () => {},
                    contains: () => false
                },
                getAttribute: () => '',
                setAttribute: () => '',
                closest: () => ({ style: {} }),
                querySelectorAll: () => []
            };
        }
        return this.elements[id];
    }
};

global.currentLanguage = 'en';
global.customPresets = {};

// Clean markdown text block wrappers
function cleanMarkdownJson(rawText) {
    return rawText.replace(/^```[a-zA-Z]*\s*/, '').replace(/\s*```$/, '');
}

console.log('Running app parser logic tests...');

// Test 1: Markdown JSON strip backticks
const markdownJson = `\`\`\`json
{
    "name": "Test Preset",
    "calloutLeft": "Left text",
    "primaryColor": "#004124"
}
\`\`\``;

const cleaned = cleanMarkdownJson(markdownJson);
const parsed = JSON.parse(cleaned);
assert.strictEqual(parsed.name, 'Test Preset');
assert.strictEqual(parsed.calloutLeft, 'Left text');
console.log('✓ Test 1: Clean Markdown code block wrapper successful.');

// Test 2: Standard JSON without markdown wrapper
const standardJson = `{"name": "No Wrapper", "calloutLeft": "No Wrap text", "primaryColor": "#00b0ff"}`;
const cleaned2 = cleanMarkdownJson(standardJson);
const parsed2 = JSON.parse(cleaned2);
assert.strictEqual(parsed2.name, 'No Wrapper');
console.log('✓ Test 2: Normal JSON wrapper cleaning successful.');

console.log('All tests completed successfully!');
