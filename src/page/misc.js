"use strict";
const path = require('path');

//#region Global variables
let currentDirectory = {
    path: path.resolve('./'), // current user directory (absolute)
    viewMode: 'l' // how files will be display; l: list, i: icons;
}
let highlightedItems = []; // items that was highlighted with secondary click
let clipboard = [], // store items with absolute path
    currentAction = ''; // c: copy, x: cut (move);
let activatingApp = ''; // if there is an integrated app opening an exention
let PLUGINS = {}; // plugin array for plugins to add scripts and data
let PLUGINEXT = {}; // plugin exention array
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

function extname(loc) {
    loc = path.extname(loc);
    return (loc[0] == '.') ? loc.substr(1, loc.length - 1) : loc;
}
//#endregion