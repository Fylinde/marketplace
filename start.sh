#!/bin/bash

# Log start of the script
echo "Starting React TypeScript app with hot-reload..."

# Ensure dependencies are installed
echo "Installing dependencies..."
yarn install

# Log the current directory and its contents
echo "Current working directory: $(pwd)"
echo "Contents of /app:"
ls -l /app

# Enable polling for hot-reloading in Docker
export CHOKIDAR_USEPOLLING=true
echo "CHOKIDAR_USEPOLLING is set to $CHOKIDAR_USEPOLLING"

# Start the React development server with hot-reloading
echo "Starting React development server on port 3000..."
yarn start
