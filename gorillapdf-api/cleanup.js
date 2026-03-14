'use strict';

const path = require('path');
const findRemoveSync = require('find-remove');

const uploadsPath = path.join(__dirname, 'public', 'uploads');

// Remove files older than 12 hours 
const removed = findRemoveSync(uploadsPath, { files: '*.*', age: { seconds: 43200 } });

if (removed.length > 0) {
    console.log(`[${new Date().toISOString()}] Removed files:`, removed);
} else {
    console.log(`[${new Date().toISOString()}] No files to remove`);
}