"use strict";
//main file for handling display and animation

function goUpPath() { //go __back__ (..)
    let trimPath = currentDirectory.path.split(/\//);
    let res = '';
    let l1 = 0;
    for (; l1 < trimPath.length - 1; l1++) { res += trimPath[l1] + '/' }
    pathUpdate(pathFix(res.substr(0, res.length - 1)));
}

function goDownPath(path) { //go __into__ child folder
    pathUpdate(joinPath(currentDirectory.path, path));
}

function pathUpdate(path) {
    highlightedItems = []; //clear highlight items
    path = pathFix(path);
    currentDirectory.path = path;
    document.getElementById('pathInput').value = path;
    document.getElementById('navActive').innerHTML = getFolder(path);
    let trimPath = path.split(/\//);
    document.getElementById('navInActive').innerHTML =
        (isRoot(path)) ? '' : trimPath[trimPath.length - 2];
    contentUpdate();
}

function contentUpdate() {
    sendData('getDirContent', currentDirectory.path);
}

function highlightItem(event, item, itemObj, isFolder) {
    if (event.button == 0 && item && isFolder) {
        goDownPath(item);
        return
    } else if (item == undefined) {
        highlightedItems = [];
        let child = document.getElementById('fileList').children;
        for (let cur of child)
            cur.style.backgroundColor = ''; //remove background
    }
    if (event.button == 0) {
        // if primary click
        let cdPath = currentDirectory.path;
        shell.openPath(joinPath(cdPath, item));
    }
    if (event.button != 2) return
    let b = false;
    for (let l1 of highlightedItems) //check if item already highlighted
        if (l1 == item) {
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

function addToClipboard() {
    clipboard = [];
    for (let cur of highlightedItems)
        clipboard.push(joinPath(currentDirectory.path, cur));
    document.getElementById('actPaste').style.display = '';
    highlightItem();
}

document.onkeydown = (ev) => {
    switch (ev.key) {
        case 'Escape':
            highlightItem();
            break;
        default:
            break;
    }
}