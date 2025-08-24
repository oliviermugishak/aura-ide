import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as dotenv from "dotenv";
import { logger } from "@aura/shared";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

logger.info("Aura electron instance starting...");
console.log("Does logging even works");
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    frame: false,
    titleBarStyle: "hidden",
    resizable: true,
    transparent: true,
    hasShadow: true,
    title: process.env.APP_NAME || "Notiq",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.setMenu(null);

  // In development, use Vite's dev server
  if (process.env.NODE_ENV === "development") {
    const devServerURL = `http://localhost:5173`;
    mainWindow.loadURL(devServerURL);

    // Open DevTools in development
    if (process.env.ELECTRON_ENABLE_LOGGING) {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../renderer/dist/index.html"));
  }
}
// this should be moved to the next level
app.whenReady().then(() => {
  createWindow();

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
