"use strict";
const { ipcRenderer, shell } = require('electron')

ipcRenderer.on('sendCurrentDir', (event, path) => {

    pathUpdate(path);
})

ipcRenderer.on('sendDirContent', (event, message, fType) => {
    let element = document.getElementById('fileList');
    element.innerHTML = ''; //clear content
    message = message.split('/*/');
    fType = fType.split('/*/');
    let l1 = 0;
    for (; l1 < message.length; l1++) {
        let button = document.createElement('button');
        button.innerHTML = message[l1];
        if (fType[l1] == 'e') {
            //if error
            button.style.color = 'var(--attention)'
        } else if (fType[l1] == 'f') {
            let cdPath = currentDirectory.path;
            button.setAttribute('onclick', `shell.openPath('${cdPath + ((cdPath== '/') ? '' : '/') + message[l1]}')`); //edit this for cross-platform
        } else if (fType[l1] == 'd') {
            //id directory
            button.style.color = 'var(--secondary-1)';
            button.setAttribute('onclick', `goDownPath('${message[l1]}')`);
        };
        let element = document.getElementById('fileList');
        element.appendChild(button);
    }

    //handle display scoll
    document.documentElement.scrollTop = 0;
    document.getElementById('mainScreen').style.height = `calc(${l1+1} * 1.5em + 1em)`;
    if (document.getElementById('mainScreen').clientHeight < document.documentElement.clientHeight) {
        document.getElementById('mainScreen').style.height = `100vh`;
    }
})

function sendData(channel, data) {
    ipcRenderer.send(channel, data);
}