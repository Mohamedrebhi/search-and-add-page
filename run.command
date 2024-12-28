#!/bin/bash

# Navigate to the frontend directory and start the React server
cd ~/Desktop/riadh
npm start &  # The '&' runs the command in the background

# Navigate to the backend directory and start the Flask server
cd ~/Desktop/riadh/src/backend
python3 app.py &  # The '&' runs the command in the background

# Wait for both processes to run in the background
wait
