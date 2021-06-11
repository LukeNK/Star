# Star
A ~~cross-platform~~ file manager focus on simple design but feature-rich. Currently in active development. Version `1.x` means release still in development. 

## Usage
Right now, it can only display files, folders and allow you to open files with default app. Delete, move, copy feature for folder will be add soon.

### How to use
Primary click to open file/folder, secondary click to highlight (select) file. Noted that left hand also supported (because I am left handed ^^).

## Plugin
*For developers: you can refer to `plugin/README.md`* \
Plugin are currently in development, which in future will have documentation and support external plugins. Currently we have an intergrated text editor and are planning to make a multimedia player (check `TODO` for updates on the process).

## Screenshots
### Version `1.2.0` teaser image
The main screen
![alt text](https://cdn.discordapp.com/attachments/851724380626485269/851724489326067722/unknown.png)
Integrated editor
![alt text](https://cdn.discordapp.com/attachments/851724380626485269/851738072584421416/unknown.png)
### Version `1.0.0` development
![1.0.0](https://cdn.discordapp.com/attachments/704502790055133245/808542256427958282/unknown.png)

## Port to another platform
I'm researching the way to port into MacOS and and Linux, but...
- To make for MacOS require a Mac (which I don't have right now)
- To make for Linux, we current have [this issue](https://github.com/electron-userland/electron-build-service/issues/9) which I will try my best to fix it, but not anytime soon. \
However, all of the source code was built with cross-platform philosophy, so the process will be really quick if I can fix those issue.

## Why?
Why not after all? \
I have searched for a simple file manager that include many feature inside it for a long time, but I didn't see anything that seems to fit my style, so I created one. I don't really hope that this project will go any further than my laptop, but if it do, thank you for developers who helped my with this project and users who report bugs and share their experience with me. Being a student, programming everyday is very hard, so I am sorry in advance for any inconvenience. \
Again, thank you for making and using this project, and reading my broken English this far.

## Run/build the app
*Currently, only Windows app was fully tested* \
Start by running `npm run start` in `src` directory. For Visual Studio Code users, you can simply press `F5` to start running the app. \
You can make a full installation by using `npm run dist`, or make the portable version by using `npm run winPort` (in `src` directory). Make both by using the `winBuild.js` script (the script will automatically change the working directory).

## Channel naming
Each data channel have prefix get/send. `get` is from renderer to main, `send` is from main to renderer, and as an respond for `get`. \
Each action channel have prefix do/did. `do` is from renderer to main and `did` is callback from main to renderer stated that the action was done.
