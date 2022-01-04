const { BrowserWindow, app } = require('electron');
const windowManager = require('../plugins/electron-window-manager');
const path = require('path');
function createHomeWin() {
  const win = windowManager.open( // name, title, url, setupTemplate, setup, showDevTools
    'HOME',
    'electorn-container',
    '',
    false,
    {
      width: 800,
      height: 600,
      resizeable: false,
      // frame: false,
      center: true,
      transparent: false,
      backgroundColor: '#fafafa',
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
      }
    }
  );
  win.object.webContents.loadURL('file://' + path.resolve(__dirname, '../home.html'))
  win.object.center();
  win.object.webContents.on('did-finish-load', () => {
    console.log('did-finish-load');
    win.object.webContents.executeJavaScript(`
      window.api3 = 'api';
    `)
  })
}

function quitIfNoWindow() {
  setTimeout(() => {
    const wins = BrowserWindow.getAllWindows();
    if (wins.length === 0) app.quit();
  }, 500);
}

module.exports = {
  createHomeWin,
  quitIfNoWindow,
}
