"use strict";
//main file for handling display and animation

function goUpPath() { //go __back__ (..)
    let trimPath = currentDirectory.path.split(/\//);
    let res = '';
    let l1 = 0;
    for (; l1 < trimPath.length - 1; l1++) { res += trimPath[l1] + '/' }
    pathUpdate(pathFix(res.substr(0, res.length - 1)));
}

function goDownPath(path) { //go __into child folder
    let sep = (currentDirectory.path[currentDirectory.path.length - 1] == '/') ? '' : '/';
    pathUpdate(currentDirectory.path + sep + path);
}

function pathUpdate(path) {
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

let highlightedItems = [];

function highlightItem(item) {
    if (item == undefined) {
        let cur;
        let child = document.getElementById('fileList').children;
        for (let cur of child) {
            cur.style.backgroundColor = '';
        }
    }
}

function getActionMenu() {

}

document.onkeydown = (ev) => {
    switch (ev.key) {
        case 'Escape':
            highlightedItems = [];
            highlightItem();
            break;
        default:
            break;
    }
}