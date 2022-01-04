
const { app } = require('electron');
const { start } = require('./main');

app.whenReady().then(() => {
  start();
})