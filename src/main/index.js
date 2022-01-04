const { init } = require('./init');
const { createDevtoolsShortcut } = require('./shortcut');
const { createHomeWin } = require('./window');

exports.start = () => {
  init()
  createHomeWin();
  createDevtoolsShortcut();
}
