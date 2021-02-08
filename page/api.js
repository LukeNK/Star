"use strict";
const { ipcRenderer } = require('electron')

ipcRenderer.on('sendCurrentDir', (event, path) => {
    pathUpdate(path);
})

ipcRenderer.on('sendDirContent', (event, message, fType) => {
    let element = document.getElementById('fileList');
    element.innerHTML = '<a href="javascript:location.reload(true)">Refresh this Page</a>'; //remove later
    message = message.split('/*/');
    fType = fType.split('/*/');
    let l1 = 0;
    for (; l1 < message.length; l1++) {
        let button = document.createElement('button');
        button.innerHTML = message[l1];
        if (fType[l1] == 'e') {
            button.style.color = 'var(--attention)'
        } else if (fType[l1] == 'd') {
            button.style.color = 'var(--secondary-1)';
            button.setAttribute('onclick', `goDownPath('${message[l1]}')`);
        };
        let element = document.getElementById('fileList');
        element.appendChild(button);
    }

    if (document.getElementById('fileList').scrollHeight > document.getElementById('fileList').clientHeight) {
        document.getElementById('fileList').style.height = `calc(${l1+1} * 1.5em + 2px)`;
    } else {
        document.getElementById('fileList').style.height = 'calc(100% - 2em)';
    }
})

function sendData(channel, data) {
    ipcRenderer.send(channel, data);
}