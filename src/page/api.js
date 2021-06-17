"use strict";
const { ipcRenderer, shell } = require('electron');
let dirAutoUpdate; // auto update directory interval

ipcRenderer.on('sendCurrentDir', (event, loc) => {
    currentDirectory.path = loc;
    contentUpdate();
});

ipcRenderer.on('sendDirContent', (event, message, fType) => {
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
    let l1 = 0;
    for (; l1 < message.length; l1++) {
        let button = document.createElement('a'); // Link look like a button
        if (currentDirectory.viewMode == 'i') {
            // icon display
            button.style.width = '5em';
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
            button.setAttribute('onmousedown', `return clickItem(event, this.innerHTML, this);`);
        } else if (fType[l1] == 'd') {
            //id directory
            button.style.color = 'var(--secondary-1)';
            button.setAttribute('onmousedown', `return clickItem(event, this.innerHTML, this, true)`);
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