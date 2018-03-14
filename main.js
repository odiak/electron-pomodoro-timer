const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    resizable: false,
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true,
    })
  );
});

app.on('window-all-closed', () => {
  app.quit();
});
