"use strict";

const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require("path");
const misc = require('./backend/misc');

let currentDirectory = {
    finishLoad: true, //if the data loading completed
    content: [],
    contentType: []
}

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
    listDirectory('./', (files) => {
        win.webContents.send('sendDirContent', misc.arr2str(files))
    });
    win.webContents.send('sendCurrentDir', path.resolve('./'));
    //#endregion

    //#region dir listener
    ipcMain.on('getDirContent', (event, path) => {
        listDirectory(path, (files) => {
            win.webContents.send('sendDirContent', misc.arr2str(files))
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
    currentDirectory.finishLoad = false;
    fs.readdir(path, (err, files) => {
        if (err) throw err;
        //currentDirectory.content = files;
        let l1 = 0;
        for (; l1 < files.length; l1++) {
            //currentDirectory.contentType[l1] = fs.lstatSync(files[l1]).isDirectory();
        }
        //currentDirectory.finishLoad = true;
        callback(files);
    });
}