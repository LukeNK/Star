"use strict";

let currentDirectory = {
    path: './',
    windowsFS: false
}

function isAlpha(str) { return /^[a-zA-Z() ]+$/.test(str) }

function isRoot(path) {
    if (isAlpha(path[0])) {
        if (path.length == 2 || path.length == 3)
            return true
    } else {
        if (path.length == 1)
            return true
    }
    return false
}

function getFolder(path) {
    path = path.split('/');
    return path[path.length - 1];
}

function pathFix(str) {
    let res = str;
    if (res.length == 2 && isAlpha(res[0])) {
        return res[0] + ':/';
    } else if (res.length == 1 && !isAlpha(res[0])) {
        return res[0];
    }
    return res;
}