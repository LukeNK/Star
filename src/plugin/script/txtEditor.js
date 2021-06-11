PLUGINS.txtEditor = {
    currentFile: '',
    open: (event, item, itemObj, isFolder) => {
        activatingApp = 'txt';
        PLUGINS.txtEditor.currentFile = item;
        sendData('getFileContent', item);
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
PLUGINEXT.txt = PLUGINS.txtEditor; // push to .txt extention