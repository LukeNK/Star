# Star
A lightweight ~~cross-platform~~ file manager focus on simple design.

# Todo
- [x] API for get currentDir, dirContent
- [ ] Refresh button 
    - [x] Fix refresh bug
    - [ ] Icon
- [ ] Fix newline error when file name is longer than the width
- [x] Fix clientHeight and scrollHeight bug. Problem can be reproduce by go from a larger folder to smaller folder
- [ ] Navigation pannel
- [ ] Test on UNIX filesystem
- [ ] Accept input in `<input id="pathInput">`

## Channel naming
Each channel have prefix get/send. `get` is from renderer to main, `send` is from main to renderer, and as an respond for `get`