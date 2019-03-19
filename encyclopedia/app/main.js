'use strict';

const { app, BrowserWindow } = require('electron');

let main = () => {
    let mainWindow = new BrowserWindow({
        //width: 1200,
        //height: 1000,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.maximize();
    mainWindow.show();
    mainWindow.setMenu(null);
    mainWindow.loadFile('./app/index.html');
    //mainWindow.webContents.openDevTools();
}

app.on('ready', main);

app.on('window-all-closed', () => {
    app.quit();
});