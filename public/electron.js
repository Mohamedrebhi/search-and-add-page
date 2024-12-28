const { exec } = require('child_process');
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Function to create the Electron window
function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,  // Don't use node integration for security
      webSecurity: false,      // Avoid blocking non-secure resources (if required)
    }
  });

  // Debugging: Check if the index.html file exists and log the path
  const indexPath = path.join(__dirname, 'build', 'index.html');
  console.log("Loading index.html from:", indexPath);

  // Using loadURL with the file path to ensure Electron resolves it correctly
  const fileUrl = `file://${indexPath}`;
  win.loadURL(fileUrl)
    .catch(err => {
      console.error("Error loading index.html:", err);
      win.loadURL("data:text/html,Error loading page"); // Fallback in case of error
    });

  // Open DevTools for debugging
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

// When the app is ready, create the window
app.whenReady().then(() => {
  startBackend();  // Start the Flask backend
  createWindow();  // Create the Electron window
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Function to start the Flask backend
function startBackend() {
  const backendScriptPath = path.join(__dirname, 'start-backend.js'); // Path to the start-backend.js script
  exec(`node ${backendScriptPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error('Error starting the backend:', err);
      return;
    }
    if (stderr) {
      console.error('Backend error:', stderr);
      return;
    }
    console.log('Backend started:', stdout);
  });
}
