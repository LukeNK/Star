electron.ipcRenderer.on('currentDirectoryContent', (event, message) => {
    message = message.split('/*/');
    let l1 = 0;
    for (; l1 < message.length; l1++) {
        let para = document.createElement('p');
        let node = document.createTextNode(message[l1]);
        //para.setAttribute('id', `displayMenu${l1}`);
        para.appendChild(node);

        let element = document.getElementById('fileList');
        element.appendChild(para);
    }
})