import { app, shell, BrowserWindow } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import fs from 'fs';

const WebSocket = require('ws');

// Electron reload
try {
  require("electron-reloader")(module);
} catch {
  // Ignore
}

// Path to the JSON file for storing student data
const studentDataFile = join(app.getPath('userData'), 'students.json');

// Initialize student storage (load existing data)
let students = {};

// Function to load students from the JSON file
function loadStudents() {
  if (fs.existsSync(studentDataFile)) {
    const data = fs.readFileSync(studentDataFile, 'utf-8');
    students = JSON.parse(data);
  }
}

// Function to store student data in the JSON file
function saveStudentData(student) {
  const { studentNumber, email, firstName, lastName, section } = student;

  if (students[studentNumber]) {
    return { success: false, message: "Student already registered" };
  }

  // Store the student data
  students[studentNumber] = {
    studentNumber,
    email,
    firstName,
    lastName,
    section,
  };

  // Save to JSON file
  fs.writeFileSync(studentDataFile, JSON.stringify(students, null, 2));

  return { success: true, message: "Student registered successfully" };
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

  // HMR for renderer based on electron-vite cli.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// Electron app ready
app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  // Load existing students
  loadStudents();

  // Watch for shortcuts in development
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // WebSocket server logic for handling assessments and students
  const assessments = {}; // Store assessments in memory
  const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8080 }); // Bind to all network interfaces

  wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send the current student data when a new client connects
    ws.send(JSON.stringify({ type: "STUDENT_DATA", data: Object.values(students) }));

    // If an assessment exists, send it to the newly connected client
    if (assessments.currentAssessment) {
      ws.send(JSON.stringify({ type: 'newAssessment', assessment: assessments.currentAssessment }));
    }

    // Listen for messages from the client
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        // Handle incoming messages
        switch (data.type) {
          case 'newAssessment':
            if (data.assessment) {
              // Store the assessment
              assessments.currentAssessment = data.assessment;

              // Broadcast the assessment to all connected clients
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({ type: 'newAssessment', assessment: data.assessment }));
                }
              });
            }
            break;

          case 'register':
            if (data.data) {
              const result = saveStudentData(data.data);
              ws.send(JSON.stringify({ type: 'registerResponse', result }));
            }
            break;

          case 'getStudents':
            ws.send(JSON.stringify({ type: "STUDENT_DATA", data: Object.values(students) }));
            break;

          default:
            ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
            break;
        }
      } catch (error) {
        console.error("Error parsing message", error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid data format' }));
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
