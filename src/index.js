"use strict";
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs-extra');
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
    win.webContents.on('did-finish-load', doneInit);
})

//all listener
//#region init
fs.readFile('./user/lastSessionPath', "utf8", (err, data) => {
    if (err) {
        fs.mkdirSync('./user');
        fs.writeFileSync('./user/lastSessionPath', path.resolve('./'))
        user.path = path.resolve('./');
    } else user.path = path.resolve(data);
});

function doneInit() {
    win.webContents.send('sendCurrentDir', path.resolve(user.path).replace(/\\/g, '/'));
}
//#endregion

//#region listener
ipcMain.on('getDirContent', (event, path) => {
    listDirectory(path, (files, fType) => {
        win.webContents.send('sendDirContent', files, fType)
    })
    user.path = path;
    fs.writeFile('./user/lastSessionPath', user.path, (err) => {
        if (err) console.log(err)
    })
});

ipcMain.on('getFileContent', (event, file) => {
    file = path.resolve(user.path, file); // file is relative
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            win.webContents.send('sendFileContent', err);
        } else
            win.webContents.send('sendFileContent', data);
    })
});

ipcMain.on('doSaveFile', (event, arr) => {
    let file = arr[0];
    let data = arr[1];
    file = path.resolve(user.path, file); // file is relative
    fs.writeFile(file, data, 'utf8', (err) => {
        if (err) {
            console.log(err);
            win.webContents.send('didSaveFile', err);
        }
    });
});

ipcMain.on('doCopy', (event, files) => {
    let callTime = files.length;
    for (let file of files) {
        let nDir = path.resolve(user.path, path.basename(file));
        if (fs.lstatSync(file).isDirectory()) {
            fs.ensureDirSync(nDir);
            fs.copy(file, nDir, callCount);
        } else {
            fs.writeFile(nDir, '', (err) => {
                if (err) return;
                fs.copy(file, nDir, callCount)
            })
        }
    }

    function callCount(err) {
        if (err) console.log(err);
        callTime--;
        if (callTime == 0)
            listDirectory(user.path, (files, fType) => {
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

ipcMain.on('doRename', (event, file, name) => {
    file = path.resolve(user.path, file);
    name = path.resolve(user.path, name);
    fs.rename(file, name, (err) => {
        listDirectory(user.path, (files, fType) => {
            win.webContents.send('sendDirContent', files, fType)
        })
    })
});

ipcMain.on('doDelete', (event, files) => {
    let callTime = files.length;
    for (let file of files)
        fs.remove(file, callCount);

    function callCount(err) {
        if (err) console.log(err);
        callTime--;
        if (callTime == 0)
            listDirectory(user.path, (files, fType) => {
                win.webContents.send('sendDirContent', files, fType)
            })
    }
});

ipcMain.on('getPluginList', (event) => {
    listDirectory('./plugin/script', (files) => {
        let callTime = files.length;
        let dir = './plugin/script/',
            scripts = []
        for (let file of files)
            fs.readFile(dir + file, 'utf8', (err, data) => {
                if (err) { callCount(err); return; }
                scripts.push(data);
                callCount();
            });

        function callCount(err) {
            if (err) console.log(err);
            callTime--;
            if (callTime == 0) {
                win.webContents.send('sendPluginList', scripts);
                console.log('Plugin loaded')
            }
        }
    });
});

ipcMain.on('window', (event, command) => {
    switch (command) {
        case 'close':
            try { win.close(); } catch (err) {};
            break;
    }
});
//#endregion

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