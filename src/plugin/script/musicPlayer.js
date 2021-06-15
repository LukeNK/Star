(() => {
    getData('./plugin/html/musicPlayer.html', (err, data) => {
        document.body.innerHTML += data;
    })

    PLUGINS.musicPlayer = {
        ext: [
            'mp3',
            'wav',
            // untested
            'ogg'
        ],
        curAudio: undefined,
        msg: 'Playing ',
        open: (event, item, itemObj, isFolder) => {
            if (!PLUGINS.musicPlayer.curAudio)
                document.getElementById('bottomBar').innerHTML = `<button id="musicPlayer-button" onclick="PLUGINS.musicPlayer.show(event)">Playing</button>` + document.getElementById('bottomBar').innerHTML;
            document.getElementById('musicPlayer').style.left = event.x + 'px';
            document.getElementById('musicPlayer').style.bottom = ''; // clear
            document.getElementById('musicPlayer').style.top = event.y + 'px';
            document.getElementById('musicPlayer').style.display = 'block';

            if (PLUGINS.musicPlayer.curAudio) PLUGINS.musicPlayer.curAudio.pause();
            PLUGINS.musicPlayer.curAudio = new Audio(path.join(currentDirectory.path, item));
            PLUGINS.musicPlayer.curAudio.play();
            PLUGINS.musicPlayer.curAudio.volume = document.getElementById('musicPlayer-vol').value / 100;

            // currentTime interval
            PLUGINS.musicPlayer.curInterval = setInterval(() => {
                let cur = PLUGINS.musicPlayer.curAudio.currentTime,
                    dur = PLUGINS.musicPlayer.curAudio.duration;
                if (cur == dur) clearInterval(PLUGINS.musicPlayer.curInterval);
                document.getElementById('musicPlayer-cur').value = 1000 * cur / dur; // 1000, not 100
                document.getElementById('musicPlayer-button').innerHTML = `${PLUGINS.musicPlayer.msg}${parseInt(cur/60)}:${parseInt(cur % 60)}`;
            }, 500)
        },
        show: (event) => {
            // show controls
            document.getElementById('musicPlayer').style.display = 'block'
            document.getElementById('musicPlayer').style.left = event.x + 'px';
            document.getElementById('musicPlayer').style.top = ''; // clear
            document.getElementById('musicPlayer').style.bottom = '10vh';
        },
        hide: () => {
            // hide controls
            document.getElementById('musicPlayer').style.display = ''
        },
        onVolChange: (vol) => {
            PLUGINS.musicPlayer.curAudio.volume = vol / 100;
            document.getElementById('musicPlayer-button').innerHTML = 'Volume: ' + vol;
        },
        onCurChange: (pos) => {
            // on current time change
            PLUGINS.musicPlayer.curAudio.currentTime = PLUGINS.musicPlayer.curAudio.duration * pos / 1000;
        },
        curInterval: undefined,
        onLoop: () => {
            PLUGINS.musicPlayer.curAudio.loop = !PLUGINS.musicPlayer.curAudio.loop;
            if (PLUGINS.musicPlayer.curAudio.loop) { PLUGINS.musicPlayer.msg = 'Loop ' } else PLUGINS.musicPlayer.msg = 'Playing '
        }
    }
    for (let ext of PLUGINS.musicPlayer.ext)
        PLUGINEXT[ext] = PLUGINS.musicPlayer.open;
})()