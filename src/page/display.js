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
                (PLUGINEXT[extname(item)]).open(event, item, itemObj, isFolder);
            } catch (err) {
                console.log('Plugin error');
                console.log(err);
            }
            return
        }
        let cdPath = currentDirectory.path;
        shell.openPath(joinPath(cdPath, item));
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

function addToClipboard() {
    clipboard = [];
    for (let cur of highlightedItems)
        clipboard.push(joinPath(currentDirectory.path, cur));
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

function closeApp() {
    if (activatingApp) {
        (PLUGINEXT[activatingApp]).close();
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