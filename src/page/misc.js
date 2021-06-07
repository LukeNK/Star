"use strict";
//#region Global variables
let currentDirectory = {
    path: './'
}
let highlightedItems = []; // items that was highlighted with secondary click
let clipboard = [], // store items with absolute path
    currentAction = ''; // c: copy, x: cut (move);
//#endregion

//#region Prototypes
Array.prototype.remove = function(item) {
        // remove every item in an array
        let index = (this.indexOf(item) != -1) ? this.indexOf(item) : -1;
        do {
            this.splice(index, 1);
            index = this.indexOf(item);
        } while (index != -1);
    }
    //#endregion

//#region Functions
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

function joinPath(a, b) {
    return a + ((a[a.length - 1] == '/') ? '' : '/') + b;
}

function extname(path) {
    for (let l1 = path.length - 1; l1 >= 0; l1--) {
        if (path[l1] == '.')
            return (l1 == 0) ? '' : path.substr(l1, path.length - l1);
    }
    return ''
}
//#endregion