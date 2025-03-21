const electron = require('electron')
const { app, BroserWindow, BrowserWindow } = electron;
const ipc = electron.ipcMain;
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        resizable: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        frame: false,
        transparent: true
    });

    win.loadFile(path.join(__dirname, '/src/home/index.html'));

    ipc.on('exit', () => {
        app.quit();
    });
    
    ipc.on('min', () => {
        win.isMinimized() ? win.restore() : win.minimize();
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

