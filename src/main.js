const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron');
const path = require('path');
const url = require('url')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const isMac = process.platform === 'darwin'

let mainWindow

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 550,
    height: 650,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: 'detach' });
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

/* === Setup Menu === */

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ]
        : [
            { role: 'close' }
          ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://businessbots.co')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/* === === */


let win_openaiKey;

function dialog_openaiAPIKey() {
  win_openaiKey = new BrowserWindow({
    width:360,
    height: 120, 
    'parent': mainWindow,
    'show': false,
    'modal': true,
    'alwaysOnTop' : true, 
    'title' : "Open AI API Key",
    'autoHideMenuBar': true,
    'webPreferences' : { 
      "nodeIntegration":true,
      "sandbox" : false 
    }   
  });
  win_openaiKey.on('closed', () => { 
    win_openaiKey = null 
    //callback(promptAnswer);
  })

  // Load the HTML dialog box
  const html_openaiKeyDialog = url.format({
    protocol: 'file',
    pathname: path.join(__dirname, 'prompt.html'), 
    slashes: true,
  });

  //win_openaiKey.loadURL(html_openaiKeyDialog)
  win_openaiKey.loadFile(path.join(__dirname, 'prompt.html'))
  win_openaiKey.once('ready-to-show', () => { win_openaiKey.show() })
}