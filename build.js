const fs = require('fs');
const path = require('path');

// Basic minification function
function minify(code) {
  return code
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove spaces around operators and punctuation
    .replace(/\s*([{}();,=])\s*/g, '$1')
    .replace(/\s*([<>!]=?)\s*/g, '$1')
    .replace(/\s*([+\-*/%&|^])\s*/g, '$1')
    // Remove leading/trailing spaces
    .trim();
}

// Read the compiled JS file
const inputFile = path.join(__dirname, 'dist', 'index.js');
const outputDir = path.join(__dirname, 'dist');

if (!fs.existsSync(inputFile)) {
  console.error('TypeScript compilation failed - no output file');
  process.exit(1);
}

const code = minify(fs.readFileSync(inputFile, 'utf8'));

// Create ES module version (.mjs)
const esmCode = code
  .replace('"use strict";Object.defineProperty(exports,"__esModule",{value: true});exports.default=', 'export default ')
  .replace(/module\.exports\s*=/, 'export default');
fs.writeFileSync(path.join(outputDir, 'zephyr-events.mjs'), esmCode);

// Create CommonJS version (.js) 
fs.writeFileSync(path.join(outputDir, 'zephyr-events.js'), code);

// Create UMD version
const umdCode = `(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.zephyrEvents = factory());
}(this, (function () { 'use strict';
  ${code.replace('module.exports =', 'return')}
})));`;

fs.writeFileSync(path.join(outputDir, 'zephyr-events.umd.js'), umdCode);

console.log('Built:');
console.log(`  ${fs.statSync(path.join(outputDir, 'zephyr-events.js')).size}B: zephyr-events.js`);
console.log(`  ${fs.statSync(path.join(outputDir, 'zephyr-events.mjs')).size}B: zephyr-events.mjs`);  
console.log(`  ${fs.statSync(path.join(outputDir, 'zephyr-events.umd.js')).size}B: zephyr-events.umd.js`);