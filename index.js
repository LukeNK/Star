"use strict";

const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require("path");
const misc = require('./backend/misc');

let win; //windows

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
    win.webContents.send('sendCurrentDir', path.resolve('./'));
    //#endregion

    //#region dir listener
    ipcMain.on('getDirContent', (event, path) => {
        listDirectory(path, (files, fType) => {
            win.webContents.send('sendDirContent', misc.arr2str(files), misc.arr2str(fType))
        })
    });
    ipcMain.on('window', (event, command) => {
        switch (command) {
            case 'close':
                try { win.close(); } catch (err) {}
                break;
        }
    });
    //#endregion
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

function listDirectory(path, callback) {
    fs.readdir(path, (err, files) => {
        if (err) throw err;
        let l1 = 0;
        let type = []
        let sep = (misc.isWindowsFS(path)) ? '\\' : '/'
        for (; l1 < files.length; l1++) {
            try {
                type[l1] = (fs.lstatSync(`${path + sep + files[l1]}`).isDirectory()) ? 'd' : 'f';
            } catch (err) { type[l1] = 'e' }
        }
        callback(files, type);
    });
}