const { app, BrowserWindow, ipcMain, remote } = require('electron');

function createWindow () {
  // Cria uma janela de navegação.
  let win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // e carregar o index.html do aplicativo.
  win.loadFile('src/index.html');
}

app.whenReady().then(createWindow)

ipcMain.on('saveConfig', (event, config, configName) => {
  let configuration = {
    name: configName,
    config: config
  }

  // db.get("configs")
  // .push(configuration)
  // .write()

  //event.sender.send('return', 'teste');
});


ipcMain.on('loadConfig', (event, configName) => {
  console.log(configName);
  return 'Teste do biroliro';
});