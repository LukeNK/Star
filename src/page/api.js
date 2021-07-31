"use strict";
const { ipcRenderer, shell } = require('electron');
let dirAutoUpdate; // auto update directory interval
const path = require('path');

//#region Global variables
let currentDirectory = {
    path: path.resolve('./'), // current user directory (absolute)
    files: [], // List of file name
    viewMode: 'l' // how files will be display; l: list, i: icons;
}
let highlightedItems = []; // items that was highlighted with secondary click
let clipboard = [], // store items with absolute path
    currentAction = ''; // c: copy, x: cut (move);
let activatingApp = ''; // if there is an integrated app opening an exention
let PLUGINS = {
    API: {
        sendDirContent: [
            (event, message, fType) => {
                let cdPath = currentDirectory.path;
                // try {
                //     clearInterval(dirAutoUpdate); // remove interval
                // } catch (err) {}

                // buttons
                document.getElementById('navInActive').innerHTML =
                    path.basename(path.dirname(currentDirectory.path));
                document.getElementById('navActive').innerHTML = path.basename(cdPath);
                document.getElementById('pathInput').value = cdPath;

                // fileList
                let element = document.getElementById('fileList');
                element.innerHTML = ''; // clear content
                currentDirectory.files = [];
                let l1 = 0;
                for (; l1 < message.length; l1++) {
                    currentDirectory.files.push(message[l1]); // add element to file index

                    // create buttons
                    let button = document.createElement('a'); // Link look like a button
                    if (currentDirectory.viewMode == 'i') {
                        // icon display
                        button.style.width = '14vw';
                        //button.style.height = '5em';
                        button.style.overflowWrap = 'break-word';
                    }
                    button.innerHTML = message[l1];
                    button.setAttribute('href', path.join(currentDirectory.path, message[l1]));
                    button.setAttribute('onclick', 'return false;'); // cancel out href
                    if (fType[l1] == 'e') {
                        // if error
                        button.style.color = 'var(--attention)'
                    } else if (fType[l1] == 'f') {
                        button.setAttribute('onmousedown', `return clickItem(event, currentDirectory.files[${l1}], this);`);
                    } else if (fType[l1] == 'd') {
                        // if directory
                        button.style.color = 'var(--secondary-1)';
                        button.setAttribute('onmousedown', `return clickItem(event, currentDirectory.files[${l1}], this, true)`);
                    };
                    let element = document.getElementById('fileList');
                    element.appendChild(button);
                }
                // handle display scoll
                document.getElementById('fileList').scrollTop = 0;

                // create update interval
                // dirAutoUpdate = setInterval(() => {
                //     sendData('getDirContent', currentDirectory.path)
                // }, 2000)
            },
        ]
    }
};
// plugin array for plugins to add scripts and data
let PLUGINEXT = {}; // plugin exention array
//#endregion

//#region Utils

function extname(loc) {
    loc = path.extname(loc);
    return (loc[0] == '.') ? loc.substr(1, loc.length - 1) : loc;
}
//#endregion

//#region Channel communication
ipcRenderer.on('sendCurrentDir', (event, loc) => {
    currentDirectory.path = loc;
    sendData('getDirContent', currentDirectory.path);
});

ipcRenderer.on('sendDirContent', (event, message, fType) => {
    for (const func in PLUGINS.API.sendDirContent)
        PLUGINS.API.sendDirContent[func](event, message, fType);
});

ipcRenderer.on('sendFileContent', (event, content) => {
    document.getElementById('txtEditor-value').value = content;
});

ipcRenderer.on('didSaveFile', (event, err) => {
    if (err)
        document.getElementById('txtEditor-value').value = err;
});

ipcRenderer.on('sendPluginList', (event, scripts) => {
    // execute every init script
    for (let cur of scripts) {
        let func = new Function(cur);
        func();
    }
});

/**
 * Warpper for get AJAX
 * @param {string} loc File path
 * @param {function} callback Callback (err, data)
 */
function getData(loc, callback) {
    // warpper for AJAX
    loc = path.resolve(loc);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                callback(undefined, this.responseText)
            } else if (this.status == 404) {
                callback(new Error('File not found'), undefined);
            }
        }
    };
    xhttp.open("GET", loc, true);
    xhttp.send();
}

let sendData = ipcRenderer.send;
//#endregion

//#region App functions
function goUpPath() { //go __back__ (..)
    currentDirectory.path = path.dirname(currentDirectory.path);
    sendData('getDirContent', currentDirectory.path);
}

/**
 * Go into child folder from currentDirectory
 * @param {string} loc File path relative to currentDirectory
 */
function goDownPath(loc) { //go __into__ child folder
    currentDirectory.path = path.join(currentDirectory.path, loc);
    sendData('getDirContent', currentDirectory.path);
}

/**
 * Pre-process when item was click to check if the mouse was dragged
 * @param {Event} event The main event
 * @param {string} item File name
 * @param {Object} itemObj The HTML object 
 * @param {Boolean} isFolder True if the item is folder
 */
function clickItem(event, item, itemObj, isFolder) {
    // highligh item pre-process
    document.onmouseup = (ev) => {
        clearListener();
        highlightItem(event, item, itemObj, isFolder);
    }
    document.onmousemovetime = 10;
    document.onmousemove = clearListener; // Need to change for less sensitive

    function clearListener() {
        document.onmousemovetime--;
        if (document.onmousemovetime) {
            document.onmouseup = null;
            document.onmousemove = null; // clear self
            document.onmousemovetime = undefined;
        }
    }
}

// TODO: rewrite this function for better code readability
/**
 * Process user click. If all of params was undefined, this function will clear all of highlighted items
 * @param {Event} event The main event
 * @param {string} item File name
 * @param {Object} itemObj The HTML object 
 * @param {Boolean} isFolder True if the item is folder
 */
function highlightItem(event, item, itemObj, isFolder) {
    if (event && event.button == 0 && item && isFolder) {
        // if folder and main click
        goDownPath(item);
        return
    } else if (event == undefined) {
        // if clear command
        highlightedItems = [];
        let child = document.getElementById('fileList').children;
        for (let cur of child)
            cur.style.backgroundColor = ''; //remove background
        return
    }
    if (event.button == 0) {
        // if primary click on file
        if (PLUGINEXT[extname(item)] != undefined) {
            try {
                PLUGINEXT[extname(item)](event, item, itemObj, isFolder);
                return;
            } catch (err) {
                console.log('Plugin error');
                console.log(err);
            }
        } else {
            // no plugin
            shell.openPath(path.join(currentDirectory.path, item));
        }
    }
    if (event.button != 2) return
    let b = false;
    for (let l1 in highlightedItems) //check if item already highlighted
        if (highlightedItems[l1] == item) {
            highlightedItems.splice(parseInt(l1), 1);
            b = true;
            break;
        }
    if (b) {
        itemObj.style.backgroundColor = '';
    } else {
        itemObj.style.backgroundColor = 'var(--primary-2)';
        highlightedItems.push(item);
    }
}

/**
 * Add all hightlighted items to clipboard, then clear highlighted items
 */
function addToClipboard() {
    clipboard = [];
    for (let cur of highlightedItems)
        clipboard.push(path.join(currentDirectory.path, cur));
    if (clipboard.length == 0) {
        document.getElementById('clipboardStatus').setAttribute('src', './page/clipboardNone.png');
        document.getElementById('actPaste').style.display = 'none';
    } else {
        document.getElementById('clipboardStatus').setAttribute('src', './page/clipboardFill.png');
        document.getElementById('actPaste').style.display = '';
    }
    highlightItem();
}

function pasteAction(action) {
    let channel = action || currentAction;
    if (channel == 'c') {
        channel = 'Copy';
    } else if (channel == 'x') {
        channel = 'Move';
    }
    channel = 'do' + channel;
    sendData(channel, clipboard);
}

/**
 * Take the lastest highlighted file then show popup/rename
 * @param {boolean} inp False for popup, true for doing actual rename
 */
function renameAction(inp) {
    if (!inp) {
        // Open popup
        if (highlightedItems.length == 0) return;
        let old = highlightedItems[highlightedItems.length - 1];
        document.getElementById('renamePopup-file').innerHTML =
            document.getElementById('renamePopup-in').value = old;
        document.getElementById('renamePopup').style.display = 'block';
        return
    } else {
        // Rename
        sendData('doRename',
            document.getElementById('renamePopup-file').innerHTML,
            document.getElementById('renamePopup-in').value
        )
        document.getElementById('renamePopup').style.display =
            document.getElementById('renamePopup-in').value = '';
    }
}

/**
 * Delete files in clipboard
 */
function deleteAction() {
    let temp = clipboard;
    addToClipboard();
    let file2Delete = clipboard;
    clipboard = temp;
    if (file2Delete.length == 0) return;
    sendData('doDelete', file2Delete);
    highlightedItems = [];
    highlightItem();
}

/**
 * Close plugins if activated, app if no plugins was activated
 */
function closeApp() {
    if (activatingApp) {
        PLUGINEXT[activatingApp]();
    } else sendData('window', 'close')
}

document.onkeydown = (ev) => {
    switch (ev.key) {
        case 'Escape':
            highlightItem();
            break;
        case 'Delete':
            deleteAction();
            break;
        default:
            break;
    }
}

//#endregion