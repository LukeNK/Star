(() => {
    getData('./plugin/html/txtEditor.html', (err, data) => {
        // load HTML
        document.body.innerHTML += data;
    })
    PLUGINS.txtEditor = {
        currentFile: '',
        open: (event, item, itemObj, isFolder) => {
            if (!(event || item || itemObj || isFolder)) { PLUGINS.txtEditor.close(); return } // if pass nothing, close
            activatingApp = 'txt';
            PLUGINS.txtEditor.currentFile = item;
            getData(path.join(currentDirectory.path, item), (err, data) => {
                document.getElementById('txtEditor-value').value = data || err;
            })
            document.getElementById('txtEditor').style.display = 'block';
            document.getElementById('topBar').style.left = '0';
            document.getElementById('topBar').style.width = '100%';
            document.getElementById('navigationBar').style.visibility = 'hidden';
            document.body.style.overflowY = 'hidden';
        },
        close: () => {
            document.getElementById('txtEditor').style.display = 'none';
            document.getElementById('topBar').style.left = '';
            document.getElementById('topBar').style.width = '';
            document.getElementById('navigationBar').style.visibility = '';
            document.body.style.overflowY = '';
            activatingApp = '';
        }
    }
    PLUGINEXT.txt = PLUGINS.txtEditor.open; // push to .txt extention
})()