const { globalShortcut } = require('electron');
const windowManager = require('../plugins/electron-window-manager');

function createDevtoolsShortcut() {
  globalShortcut.register('CommandOrControl+D', () => {
    const homeWin = windowManager.get('HOME');
    if (homeWin) homeWin.object.webContents.openDevTools();
  })
}

module.exports = {
  createDevtoolsShortcut,
}
