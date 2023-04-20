module.exports = {
    init,
    send,
};

const fs = require('fs');
const path = require('path');

const config = require('../../config');

let gameUpdater;

function init(state) {
    gameUpdater = state.saved.gameUpdater;

    // First app run
    if (!gameUpdater) {
        gameUpdater = state.saved.gameUpdater = getCurrentGameVersion();
    }
}

function getCurrentGameVersion() {
    return JSON.parse(
        fs.readFileSync(
            path.join(config.STATIC_PATH, 'game-version.json'),
            'utf8'
        )
    );
}

function saveNewGameVersion(state) {
    let data = JSON.stringify(state.saved.gameUpdater, null, 4);
    fs.writeFileSync(path.join(config.STATIC_PATH, 'game-version.json'), data);
}

function send(state, cb) {
    gameUpdater = state.saved.gameUpdater;
    const get = require('simple-get');

    const opts = {
        url: config.GAME_VERSION_URL,
        json: true,
    };

    get.concat(opts, function (err, res, data) {
        if (err) return console.error('Error getting game version', err);
        if (res.statusCode !== 200) {
            return console.error(
                `Error getting game version, status code: ${res.statusCode}`
            );
        }

        console.log('Got game version data', data);

        if (data.currentVersion > gameUpdater.currentVersion || data.highestHotfixVersion > gameUpdater.highestHotfixVersion) {
            gameUpdater = state.saved.gameUpdater = data;
            
            console.log('Updated game version data', data);

            if (cb) cb(true);
        }

        if (cb) cb(false);
    });
}
