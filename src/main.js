const { app, BrowserWindow, Menu, MenuItem, dialog, ipcMain } = require('electron');
const fs = require('fs')
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


// This method will be called when Electron has finished initialization and is ready to create browser windows.
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


/* === App Logic begins here === */

ipcMain.on("toMain", (event, args) => {
  if(args.includes("cmd:user-select-file")) {
    const selectFileOptions = {
      filters: [
        { name: 'Docs', extensions: ['pdf', 'txt', 'md'] }
      ]
    }
    dialog.showOpenDialog(mainWindow, selectFileOptions)
    .then(fileData => {
      if(fileData.filePaths) {
        fs.readFile(fileData.filePaths[0], 'utf8', (error, data) => {
          const userDataPath = app.getPath("userData")
          const fileName = path.basename(fileData.filePaths[0])

          fs.copyFile(fileData.filePaths[0], userDataPath+'/'+fileName, (err) => {
            if (err) throw err;
            console.log('File copied!');
          });
      
          // Send result back to renderer process
          //win.webContents.send("fromMain", responseObj);
        });
      }
    })
  }

  /*try {
    const chosenFolders = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
    if (chosenFolders && chosenFolders.canceled === false) {
     const date = format(new Date(), 'MM-DD-YYYY HH[:]mm');
     let config = JSON.stringify(ElectronStore.store);
     let configPath = path.join(chosenFolders.filePaths[0], `jsui-config (${date}).json`);
     fs.writeFileSync(configPath, config);
    }
   } catch (err) {
    logger.log(err);
   }*/
  
  /*fs.readFile("path/to/file", (error, data) => {
    // Do something with file contents

    // Send result back to renderer process
    win.webContents.send("fromMain", responseObj);
  });*/
});