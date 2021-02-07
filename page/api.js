"use strict";
const { ipcRenderer } = require('electron')

ipcRenderer.on('sendCurrentDir', (event, path) => {
    pathUpdate(path);
})

ipcRenderer.on('sendDirContent', (event, message) => {
    let element = document.getElementById('fileList');
    element.innerHTML = '<a href="javascript:location.reload(true)">Refresh this Page</a>'; //remove later
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

function sendData(channel, data) {
    ipcRenderer.send(channel, data);
}