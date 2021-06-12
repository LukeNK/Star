# Plugins
Including custom controls, theme, external HTML.

## `./.script`
Every script is an init script, (which it will execute, not treat as a function) \
For example: you should do:
```js
console.log('Hello world'); 
```
**DO NOT** do this:
```js
function outputConsole() {
    console.log('Hello world'); 
}
```
But you can do:
```js
function outputConsole() {
    console.log('Hello world'); 
}
outputConsole(); // <-- Call the function
```

# Templates
Script file
```js
// replace 'name' with your plugin name
// replace 'exention' with exention that your plugin supported
getData('./plugin/html/name.html', (err, data) => {
    // load HTML
    document.body.innerHTML += data;
})
PLUGINS.name = {
    open: (event, item, itemObj, isFolder) => {
        activatingApp = 'exention'; // your currently active extention of 'item'
        // invoke when a file was clicked
    },
    close: () => {
        // invoke when the close button was clicked
        activatingApp = ''; // clear
    }
}

// do this for every exention that you supported
PLUGINEXT.exention = PLUGINS.name; // push to .txt extention
```