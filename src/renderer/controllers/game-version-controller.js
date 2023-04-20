const { dispatch } = require('../lib/dispatcher');
const gameVersionUpdater = require('../lib/game-version-updater');

// Controls the UI checking for new versions of the app, prompting install
module.exports = class GameVersionController {
    constructor(state) {
        this.state = state;
    }

    checkNewGameVersion(silent) {
        const state = this.state;
        const self = this;

        gameVersionUpdater.send(state, (isUpdated) => {
            if (isUpdated && !silent) {
                self.showModal(
                    `${state.saved.gameUpdater.currentVersion}.${state.saved.gameUpdater.highestHotfixVersion}`
                );
            }

            gameVersionUpdater.saveNewGameVersion(state);
            self.updateGameTorrents(state.saved.gameUpdater.torrents);
        });
    }

    showModal(version) {
        this.state.modal = { id: 'game-update-available-modal', version };
    }

    updateGameTorrents(torrents) {
        const state = this.state;

        torrents.forEach((t, i) => {
            // Check if this torrent already exist by name
            const index = state.saved.torrents.findIndex(
                (x) => x.magnetURI === t.magnetURL
            );

            // It doesn't exist means we add it
            if (index === -1) {
                dispatch('onOpen', t.magnetURL);
            }
        });
    }
};
