#!/usr/bin/env node

// Simple build script for CapabilityGym static site
console.log('Building CapabilityGym...');

// Check if all required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'index.html',
    'styles.css',
    'js/app.js',
    'js/config-manager.js',
    'js/gemini-api.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(__dirname, file))) {
        console.error(`❌ Missing required file: ${file}`);
        allFilesExist = false;
    } else {
        console.log(`✅ Found: ${file}`);
    }
});

if (allFilesExist) {
    console.log('🎉 Build successful! All files are ready for deployment.');
    process.exit(0);
} else {
    console.error('❌ Build failed! Missing required files.');
    process.exit(1);
}
