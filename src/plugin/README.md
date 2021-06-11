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