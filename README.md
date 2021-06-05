# Star
A lightweight ~~cross-platform~~ file manager focus on simple design but feature-rich. Currently in active development.

## Usage
Right now, it can only display files, folders and allow you to open files with default app. Delete, move, copy feature will be add soon.

### How to use
Primary click to open file/folder, secondary click to highlight (select) file. Noted that left hand also supported (because I am left handed ^^).

## Screenshots
![alt text](https://cdn.discordapp.com/attachments/704502790055133245/808542256427958282/unknown.png)
Version v1.0.0 development

## Port to another platform
I'm researching the way to port into MacOS and and Linux, but...
- To make for MacOS require a Mac (which I don't have right now)
- To make for Linux, we current have [this issue](https://github.com/electron-userland/electron-build-service/issues/9) which I will try my best to fix it, but not anytime soon.

However, all of the source code was built with cross-platform philosophy, so the process will be really quick if I can fix those issue.

# Todo
Most of item on this list are from my experience with other file explorer, but you can add more into this list by create an issue.
- [ ] Actions (move, copy, delete) !ATTENTION!
- [ ] Accept input in `<input id="pathInput">`
- [x] API for get currentDir, dirContents
- [ ] Refresh button 
    - [x] Fix refresh bug
    - [x] Icon
    - [ ] SVG Icon instead of png
- [x] Fix newline error when file name is longer than the width
- [x] Fix clientHeight and scrollHeight bug. Problem can be reproduce by go from a larger folder to smaller folder
- [ ] Navigation pannel
- [ ] Test on UNIX filesystem
- [x] Cross-plaform by using electron-builer
- [ ] User folder
    - [x] LastSession
- [ ] Multi-media features/ integrated app/ plugin
    - [ ] Scan ./plugin
    - [ ] Documentation
    - [ ] Text editor
    - [ ] Music player (easy with `<audio>` tag)
        - [ ] Get files, play 
        - [ ] Style controls
    - [ ] Video player
- [x] Fix [this](https://cdn.discordapp.com/attachments/704502790055133245/850613813194915891/unknown.png)
## Channel naming
Each channel have prefix get/send. `get` is from renderer to main, `send` is from main to renderer, and as an respond for `get`