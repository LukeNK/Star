"use strict";
//main file for handling display and animation

function goUpPath() {
    let trimPath = currentDirectory.path.split(/\/|\\/);
    let res = '';
    let l1 = 0;
    for (; l1 < trimPath.length - 1; l1++) { res += trimPath[l1] + '\\' }
    pathUpdate(pathFix(res.substr(0, res.length - 1)));
}

function pathUpdate(path) {
    path = pathFix(path);
    currentDirectory.path = path;
    document.getElementById('pathInput').value = path;
    getFolder(path)
    document.getElementById('navActive').innerHTML = getFolder(path);
    let trimPath = path.split(/\/|\\/);
    document.getElementById('navInActive').innerHTML = trimPath[trimPath.length - 2]
    contentUpdate();
}

function contentUpdate() {
    sendData('getDirContent', currentDirectory.path);
}