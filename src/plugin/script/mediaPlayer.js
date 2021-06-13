getData('./plugin/html/mediaPlayer.html', (err, data) => {
    document.body.innerHTML += data;
})

PLUGINS.mediaPlayer = {
    curAudio: undefined,
    open: (event, item, itemObj, isFolder) => {
        if (!PLUGINS.mediaPlayer.curAudio)
            document.getElementById('bottomBar').innerHTML = `<button id="mediaPlayer-button" onclick="PLUGINS.mediaPlayer.show()">Playing</button>` + document.getElementById('bottomBar').innerHTML;
        document.getElementById('mediaPlayer').style.left = event.x + 'px';
        document.getElementById('mediaPlayer').style.top = event.y + 'px';
        document.getElementById('mediaPlayer').style.display = 'block';

        PLUGINS.mediaPlayer.curAudio = new Audio(path.join(currentDirectory.path, item));
        PLUGINS.mediaPlayer.curAudio.play();
    },
    show: () => {
        // show controls
        document.getElementById('mediaPlayer').style.display = 'block'
    },
    hide: () => {
        // hide controls
        document.getElementById('mediaPlayer').style.display = ''
    },
    onVolChange: (vol) => {
        PLUGINS.mediaPlayer.curAudio.volume = vol / 100;
        document.getElementById('mediaPlayer-button').innerHTML = 'Volume: ' + vol;
        volTimeout = setTimeout(() => {
            document.getElementById('mediaPlayer-button').innerHTML = 'Playing';
        }, 1000)
    },
    volTimeout: undefined
}

PLUGINEXT.mp3 = PLUGINS.mediaPlayer.open;