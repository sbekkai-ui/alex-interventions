const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "InterventionsHub",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.setMenuBarVisibility(false);
  // In dev: ../electron-dist/index.html. In packaged app: ./electron-dist/index.html (copied next to main.cjs).
  const fs = require("fs");
  const packaged = path.join(__dirname, "electron-dist", "index.html");
  const dev = path.join(__dirname, "..", "electron-dist", "index.html");
  win.loadFile(fs.existsSync(packaged) ? packaged : dev);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
