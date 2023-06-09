module.exports = {
    init,
};

function init() {
    const config = require('./config');
    const electron = require('electron');

    electron.crashReporter.start({
        productName: config.APP_NAME,
        submitURL: config.CRASH_REPORT_URL,
        globalExtra: { _companyName: config.APP_NAME },
        compress: true,
    });
}
