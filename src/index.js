"use strict";

const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require("path");

let win; //windows

let user = {
    path: "./"
}

app.whenReady().then(() => {
    //create window
    win = new BrowserWindow({
        width: 1000,
        height: 400,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('./index.html');
    win.webContents.on('did-finish-load', windowReady)
})

function windowReady() {
    //all listener
    //#region init
    fs.readFile('./user/lastSessionPath', "utf8", (err, data) => {
        if (err) {
            fs.mkdirSync('./user');
            fs.writeFileSync('./user/lastSessionPath', path.resolve('./'))
            user.path = './'
        } else user.path = data;
        win.webContents.send('sendCurrentDir', path.resolve(user.path).replace(/\\/g, '/'));
    });

    //#endregion

    //#region dir listener
    ipcMain.on('getDirContent', (event, path) => {
        listDirectory(path, (files, fType) => {
            win.webContents.send('sendDirContent', files, fType)
        })
        user.path = path;
        fs.writeFile('./user/lastSessionPath', user.path, (err) => {
            if (err) console.log(err)
        })
    });

    ipcMain.on('doCopy', (event, files) => {
        let a = user.path;
        let callTime = files.length;
        for (let file of files) {
            let b = file.split(`/`);
            b = b[b.length - 1];
            fs.copyFile(file, a + ((a[a.length - 1] == '/') ? '' : '/') + b, callCount)
        }

        function callCount(err) {
            if (err) console.log(err);
            callTime--;
            if (callTime == 0)
                listDirectory(a, (files, fType) => {
                    win.webContents.send('sendDirContent', files, fType)
                })
        }
    });

    ipcMain.on('doMove', (event, files) => {
        let a = user.path;
        let callTime = files.length;
        for (let file of files) {
            let b = file.split(`/`);
            b = b[b.length - 1];
            fs.rename(file, a + ((a[a.length - 1] == '/') ? '' : '/') + b, callCount)
        }

        function callCount(err) {
            if (err) console.log(err);
            callTime--;
            if (callTime == 0)
                listDirectory(a, (files, fType) => {
                    win.webContents.send('sendDirContent', files, fType)
                })
        }
    });

    ipcMain.on('doDelete', (event, files) => {
        let callTime = files.length;
        for (let file of files)
            fs.unlink( // I am using 14.15, will change to fs.rm
                file,
                // {
                //     'force': true,
                //     'recursive': true,
                //     'maxRetries': 3
                // },
                callCount
            );

        function callCount(err) {
            if (err) console.log(err);
            callTime--;
            if (callTime == 0)
                listDirectory(user.path, (files, fType) => {
                    win.webContents.send('sendDirContent', files, fType)
                })
        }
    });

    ipcMain.on('window', (event, command) => {
        switch (command) {
            case 'close':
                try { win.close(); } catch (err) {};
                break;
        }
    });
    //#endregion
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit()

});

function listDirectory(path, callback) {
    fs.readdir(path, (err, files) => {
        if (err) {}; //need error handling
        let l1 = 0;
        let type = []
        for (; l1 < files.length; l1++) {
            //d: directory, f: file, e: error;

            try {
                type[l1] = (fs.lstatSync(`${path + ((path[path.length - 1] == '/') ? '' : '/') + files[l1]}`).isDirectory()) ? 'd' : 'f';
            } catch (err) { type[l1] = 'e' }
        }
        callback(files, type);
    });
}