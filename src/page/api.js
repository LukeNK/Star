"use strict";
const { ipcRenderer, shell } = require('electron');
let dirAutoUpdate; // auto update directory interval

ipcRenderer.on('sendCurrentDir', (event, path) => {
    pathUpdate(path);
});

ipcRenderer.on('sendDirContent', (event, message, fType) => {
    // try {
    //     clearInterval(dirAutoUpdate); // remove interval
    // } catch (err) {}
    let element = document.getElementById('fileList');
    element.innerHTML = ''; // clear content
    let l1 = 0;
    for (; l1 < message.length; l1++) {
        let button = document.createElement('button');
        button.innerHTML = message[l1];
        if (fType[l1] == 'e') {
            // if error
            button.style.color = 'var(--attention)'
        } else if (fType[l1] == 'f') {
            let cdPath = currentDirectory.path;
            button.setAttribute('onmousedown', `highlightItem(event, this.innerHTML, this);`);
            //button.setAttribute('onclick', `shell.openPath('${cdPath + ((cdPath== '/') ? '' : '/') + message[l1]}')`); // edit this for cross-platform
        } else if (fType[l1] == 'd') {
            //id directory
            button.style.color = 'var(--secondary-1)';
            button.setAttribute('onmousedown', `highlightItem(event, this.innerHTML, this, true)`);
        };
        let element = document.getElementById('fileList');
        element.appendChild(button);
    }
    // handle display scoll
    document.documentElement.scrollTop = 0;

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

ipcRenderer.on('sendPluginList', (event, files) => {

});

function sendData(channel, data) {
    ipcRenderer.send(channel, data);
}