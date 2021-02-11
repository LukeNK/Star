# Star
A lightweight ~~cross-platform~~ file manager focus on simple design.

## Screenshots
![alt text](https://cdn.discordapp.com/attachments/704502790055133245/808542256427958282/unknown.png)
Version v1.0.0 development

# Todo
- [x] API for get currentDir, dirContentz
- [ ] Refresh button 
    - [x] Fix refresh bug
    - [ ] Icon
    - [ ] SVG Icon instead of png
- [ ] Fix newline error when file name is longer than the width
- [x] Fix clientHeight and scrollHeight bug. Problem can be reproduce by go from a larger folder to smaller folder
- [ ] Actions (move, copy, delete)
- [ ] Navigation pannel
- [ ] Test on UNIX filesystem
- [x] Cross-plaform by using electron-builer
- [ ] Accept input in `<input id="pathInput">`

## Channel naming
Each channel have prefix get/send. `get` is from renderer to main, `send` is from main to renderer, and as an respond for `get`