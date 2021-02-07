"use strict";

const { ipcRenderer } = require('electron')

ipcRenderer.on('sendDirContent', (event, message) => {
    message = message.split('/*/');
    let l1 = 0;
    for (; l1 < message.length; l1++) {
        let button = document.createElement('button');
        let node = document.createTextNode(message[l1]);
        button.appendChild(node);

        let element = document.getElementById('fileList');
        element.appendChild(button);
    }
})

ipcRenderer.on('sendCurrentDir', (event, path) => {
    pathUpdate(path);
})

function sendData(channel, path) {
    ipcRenderer.send(channel, path);
}