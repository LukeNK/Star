"use strict";

let currentDirectory = {
    path: './',
    windowsFS: false
}

function isAlpha(str) { return /^[a-zA-Z() ]+$/.test(str) }

function isWindowsFS(path) {
    if (currentDirectory.isWindowsFS == undefined) {
        let res = path.includes('\\');
        currentDirectory.isWindowsFS = res;
        return res;
    } else return currentDirectory.isWindowsFS;
}

function isRoot(path) {
    if (isWindowsFS(path)) {
        return path[path.length - 1] == ':' || path[path.length - 1] == '\\';
    } else {
        return path == '/'
    }
}

function getFolder(path) {
    if (isRoot(path)) { return path };
    let pos = path.lastIndexOf('/');
    if (pos == -1 && path[path.length - 1] == ':') { path += '\\\\' }; //windows drive 
    if (pos == -1) { pos = path.lastIndexOf('\\') }; //windows path
    let res = path.substr(pos + 1);
    if (res.length == 2 && isAlpha(res[0])) {
        return res[0] + ':\\'
    } else if (res.length == 1 && !isAlpha(res[0])) {
        return res[0]
    }
    return path.substr(pos + 1)
}

function pathFix(str) {
    let res = str
    if (res.length == 2 && isAlpha(res[0])) {
        return res[0] + ':\\';
    } else if (res.length == 1 && !isAlpha(res[0])) {
        return res[0];
    }
    return res;
}