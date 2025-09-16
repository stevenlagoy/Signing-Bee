#!/bin/bash

# Signing-Bee Setup Script for Linux
# Usage: bash setup.sh

echo "Starting setup for Signing-Bee..."

# ----- Frontend -----
echo "Installing frontend dependencies..."
cd signing-bee || { echo "signing-bee folder not found"; exit 1; }
npm install
npm install --save-dev @testing-library/react @testing-library/jest-dom jest babel-jest @babel/preset-env @babel/preset-react
cd ..

# ----- Backend -----
echo "Installing backend dependencies..."
cd backend || { echo "backend folder not found"; exit 1; }
npm install
npm install --save-dev jest supertest @babel/preset-env @babel/preset-react babel-jest
cd ..

# ----- Cypress (E2E) -----
echo "Installing Cypress..."
npm install --save-dev cypress

# ----- Check Node & npm versions -----
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

echo
echo "Setup complete! You can now run:"
echo "Frontend: cd signing-bee ; npm start"
echo "Backend: cd backend ; npm start"
echo "Frontend tests: cd signing-bee ; npm test"
echo "Backend tests: cd backend ; npm test"
echo "Cypress E2E tests: npx cypress open (from repo root)"
