// start-backend.js
const { exec } = require('child_process');
const path = require('path');

// Set the path to your Flask app
const flaskAppPath = path.join(__dirname, 'backend', 'app.py'); // Adjust as needed

// Start the Flask server
exec(`python ${flaskAppPath}`, (err, stdout, stderr) => {
  if (err) {
    console.error('Error starting Flask backend:', err);
    return;
  }
  if (stderr) {
    console.error('Flask backend error:', stderr);
    return;
  }
  console.log('Flask backend started:', stdout);
});
