import { app, shell, BrowserWindow } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
const WebSocket = require('ws');

// electron reload
try {
  require("electron-reloader")(module);
} catch {
  // Ignore
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      sandbox: false,
      webSecurity: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// Electron app ready
app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  // Watch for shortcuts in development
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // WebSocket server logic
  const assessments = {};
  const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8080 }); // Bind to all network interfaces

  wss.on('connection', (ws) => {
    console.log('Client connected');

    // If an assessment exists, send it to the newly connected client
    if (assessments.currentAssessment) {
      ws.send(JSON.stringify(assessments.currentAssessment));
    }

    // Listen for messages from the client
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        if (data.type === 'newAssessment' && data.assessment) {
          // Store the assessment
          assessments.currentAssessment = data.assessment;

          // Broadcast the assessment to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(data.assessment));
            }
          });
        }
      } catch (error) {
        console.error("Error parsing message", error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  console.log('WebSocket server started on ws://0.0.0.0:8080'); // Updated to reflect the new host
});

// Quit when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
