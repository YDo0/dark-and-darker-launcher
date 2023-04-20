const { dispatch } = require('../lib/dispatcher');
const electron = require('electron');
const fs = require('fs');
const Glob = require('glob').Glob;

// Controls the UI checking for new versions of the app, prompting install
module.exports = class GameController {
    constructor(state, config) {
        this.state = state;
        this.config = config;

        if (!this.state.saved.game) {
            this.state.saved.game = {
                executable: false,
            };
        }
    }

    findGameExecutable(cb) {
        const state = this.state;
        const config = this.config;

        if (state.saved.game.executable) {
            if (fs.existsSync(state.saved.game.executable)) {
                this.tryToRunGameExecutable(state.saved.game.executable);
                return;
            } else {
                state.saved.game.executable = false;
            }
        }

        const mg = new Glob(
            `/**/${config.PLAY_GAME_APP}`,
            {
                root: '',
                strict: false,
                nodir: true,
                absolute: true,
                maxDepth: 3,
            },
            function (err, matches) {
                if (err) {
                    state.errors.push({
                        time: new Date().getTime(),
                        message: 'Unable to find game executable. Make sure it is installed properly or run the game manually.',
                    });

                    console.error('Unable to find PLAY_GAME_APP', err)
                };
                if (cb) cb(false);
            }
        );

        mg.on('match', (match) => {
            let executablePath;

            // Check if it is in Binary folder
            if (match.includes('/Binaries/')) {
                executablePath = match;
            } else {
                executablePath = match.replace(
                    config.PLAY_GAME_APP,
                    `DungeonCrawler/Binaries/Win64/${config.PLAY_GAME_APP}`
                );
            }

            state.saved.game.executable = executablePath;
            console.log('Found PLAY_GAME_APP', executablePath, match);

            mg.abort();

            if (cb) cb(executablePath);
        });

        if (cb) cb(false);
    }

    tryToRunGameExecutable(executable) {
        if (executable) {
            electron.shell.openPath(executable);
        }
    }

    startGame() {
        this.findGameExecutable(this.tryToRunGameExecutable);
    }
};
