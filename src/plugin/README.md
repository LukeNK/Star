# Plugins
Including custom controls, theme, external HTML.

## `./.script`
Every script is an init script, (which it will execute, not treat as a function) \
For example: you could do:
```js
console.log('Hello world'); 
```
But the best way to do is using IIFE:
```js
(() => {
    // By using this, your code will not interfere with global variables
    console.log('Hello world');
})()
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
(() => {
    getData('./plugin/html/name.html', (err, data) => {
        // load HTML
        document.body.innerHTML += data;
    })
    PLUGINS.name = {
        ext: [
            // List of exentions that your plugin supported
            'ext' // No period
        ],
        open: (event, item, itemObj, isFolder) => {
            if (!(event || item || itemObj || isFolder)) { PLUGINS.name.close(); return } // When the close button was clicked, it will pass nothing, so redirect to close()
            activatingApp = 'exention'; // your currently active extention of 'item', use to make close button close your app, but can also be change by apps that were called later than yours
            // invoke when a file was clicked
        },
        close: () => {
            // invoke when the close button was clicked
            activatingApp = ''; // clear
        }
    }

    // do this for every exention that you supported
    for (let ext of PLUGINS.name.ext)
        PLUGINEXT[ext] = PLUGINS.name.open;
})()
```