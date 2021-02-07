const { app, BrowserWindow } = require('electron')
const fs = require('fs')

let currentDirectory = {
    finishLoad: true, //if the data loading completed
    content: [],
    contentType: []
}

let win; //windows

app.whenReady().then(() => {
    //create window
    win = new BrowserWindow({
        width: 800,
        height: 600,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('./index.html');

    listDirectory('./', () => {})

    win.webContents.on('did-finish-load', () => {
        listDirectory('./', (data) => {
            let res = '',
                l1 = 0
            for (; l1 < data.length; l1++) {
                res += data[l1] + '/*/';
            }
            win.webContents.send('currentDirectoryContent', res.substr(0, res.length - 3));
        })
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

function listDirectory(path, callback) {
    currentDirectory.finishLoad = false;
    fs.readdir(path, (err, files) => {
        currentDirectory.content = files;
        let l1 = 0
        for (; l1 < files.length; l1++) {
            currentDirectory.contentType[l1] = fs.lstatSync(files[l1]).isDirectory();
        }
        currentDirectory.finishLoad = true;
        callback(files);
    });
}