getData('./plugin/html/mediaPlayer.html', (err, data) => {
    document.body.innerHTML += data;
})

PLUGINS.mediaPlayer = {
    curAudio: undefined,
    open: (event, item, itemObj, isFolder) => {
        activatingApp = 'mp3';
        PLUGINS.mediaPlayer.curAudio = new Audio(path.join(currentDirectory.path, item));
        document.getElementById('bottomBar').innerHTML =
            `<button onclick="this.remove(); closeApp();">Playing: ${item}</button>` +
            document.getElementById('bottomBar').innerHTML;
        PLUGINS.mediaPlayer.curAudio.play();
    },
    close: () => {
        PLUGINS.mediaPlayer.curAudio.pause();
        PLUGINS.mediaPlayer.curAudio = '';
        activatingApp = ''; // clear
    }
}

PLUGINEXT.mp3 = PLUGINS.mediaPlayer;