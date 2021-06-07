const { execSync } = require('child_process');
const path = require('path');
let isWin = (path.sep == '/') ? false : true;

console.log('Pack for windows');
execSync('npm run dist', { cwd: 'src' });
console.log('Setup file build completed');
execSync('npm run winPort', { cwd: 'src' });
console.log('Portable file build completed');