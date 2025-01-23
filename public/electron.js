const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Menu } = require('electron');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000');
  //  // Durante o desenvolvimento

  mainWindow.setMenu(null);

  const template = [];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => (mainWindow = null));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});



/** PARA PRODUÇÃO
 * 
 * const isDev = !app.isPackaged;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.on('closed', () => (mainWindow = null));
});

 */