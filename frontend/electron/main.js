const {app, BrowserWindow} = require('electron');
const path = require('path');

let mainWindow;

async function createWindow() {
  // 动态导入electron-is-dev
  const {default: isDev} = await import('electron-is-dev');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // 加载应用
  const startUrl = isDev
    ? 'http://localhost:8000' // 开发环境使用本地服务
    : `file://${path.join(__dirname, '../dist/index.html')}`; // 生产环境使用打包后的文件

  mainWindow.loadURL(startUrl);

  // 打开开发者工具
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow().then(r => {

    });
  }
});
