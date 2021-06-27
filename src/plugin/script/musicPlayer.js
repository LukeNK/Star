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
        isLoop: false,
        msg: 'Playing ',
        queue: [],
        open: (event, item, itemObj, isFolder) => {
            if (!(event || item || itemObj || isFolder)) { PLUGINS.musicPlayer.close(); return }
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
                document.getElementById('musicPlayer--cur').value = 1000 * cur / dur;
                document.getElementById('musicPlayer-button').innerHTML = `${PLUGINS.musicPlayer.msg + parseInt(cur/60)}:${parseInt(cur % 60)}`;
                PLUGINS.musicPlayer.curAudio.loop = PLUGINS.musicPlayer.isLoop;
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
            if (PLUGINS.musicPlayer.curAudio.loop) {
                PLUGINS.musicPlayer.msg = 'Loop '
            } else
                PLUGINS.musicPlayer.msg = 'Playing ';
            PLUGINS.musicPlayer.isLoop = PLUGINS.musicPlayer.curAudio.loop;
        },
        list: () => {
            activatingApp = 'mp3'; // map just for purpose of represent
            document.getElementById('musicPlayer--main').style.display = 'block';
            document.getElementById('musicPlayer').style.visibility = 'hidden'
            document.getElementById('topBar').style.left = '0';
            document.getElementById('topBar').style.width = '100%';
            document.getElementById('navigationBar').style.visibility = 'hidden';
            document.getElementById('mainScreen').style.visibility = 'hidden';
            document.getElementById('bottomBar').style.visibility = 'hidden';
        },
        close: () => {
            activatingApp = '';
            document.getElementById('musicPlayer--main').style.display = '';
            document.getElementById('musicPlayer').style.visibility = ''
            document.getElementById('topBar').style.left = '';
            document.getElementById('topBar').style.width = '';
            document.getElementById('navigationBar').style.visibility = '';
            document.getElementById('mainScreen').style.visibility = '';
            document.getElementById('bottomBar').style.visibility = '';
        }
    }

    PLUGINS.API.sendDirContent.push((event, files, fType) => {
        for (const ref in files) {
            // filter
            if (fType[ref] == 'd') continue;
            file = files[ref];
            let matched = false;
            for (const ext of PLUGINS.musicPlayer.ext)
                if (extname(file) == ext) {
                    matched = true;
                    break
                }
            if (!matched) continue;

            document.getElementById('musicPlayer--list').innerHTML += `<p>${file}</p>`
        }
    })

    for (let ext of PLUGINS.musicPlayer.ext)
        PLUGINEXT[ext] = PLUGINS.musicPlayer.open;
})()