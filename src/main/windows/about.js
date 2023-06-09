const about = (module.exports = {
    init,
    win: null,
});

const config = require('../../config');
const electron = require('electron');

function init() {
    if (about.win) {
        return about.win.show();
    }

    const win = (about.win = new electron.BrowserWindow({
        backgroundColor: '#ECECEC',
        center: true,
        fullscreen: false,
        height: 500,
        icon: getIconPath(),
        maximizable: false,
        minimizable: false,
        resizable: false,
        show: false,
        skipTaskbar: true,
        title: 'About Launcher',
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            enableBlinkFeatures: 'AudioVideoTracks',
            enableRemoteModule: true,
        },
        width: 500,
    }));

    win.loadURL(config.WINDOW_ABOUT);

    win.once('ready-to-show', function () {
        win.show();
        // No menu on the About window
        // Hack: BrowserWindow removeMenu method not working on electron@7
        // https://github.com/electron/electron/issues/21088
        win.setMenuBarVisibility(false);
    });

    win.once('closed', function () {
        about.win = null;
    });
}

function getIconPath() {
    return process.platform === 'win32'
        ? config.APP_ICON + '.ico'
        : config.APP_ICON + '.png';
}
