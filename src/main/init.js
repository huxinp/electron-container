require('@electron/remote/main').initialize()
const windowManager = require("../plugins/electron-window-manager")

function init () {
  windowManager.init({ devMode: true });
}

module.exports = {
  init,
}