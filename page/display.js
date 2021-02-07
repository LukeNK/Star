"use strict";
//main file for handling display and animation

function pathUpdate(path) {
    let pos;
    document.getElementById('pathInput').value = path;
    pos = path.lastIndexOf('/');
    if (pos == -1) {
        //if windows path
        pos = path.lastIndexOf('\\');
    }
    document.getElementById('navActive').innerHTML = path.substr(pos + 1);
}