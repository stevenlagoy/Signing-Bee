# Signing-Bee Setup Script for Windows (with temporary bypass)
# Run in PowerShell with: powershell -ExecutionPolicy Bypass -File .\setup.ps1

Write-Host "Starting setup for Signing-Bee..."

# ----- Frontend -----
Write-Host "Installing frontend dependencies..."
cd .\signing-bee\
npm install
npm install --save-dev @testing-library/react @testing-library/jest-dom jest babel-jest @babel/preset-env @babel/preset-react

cd ..

# ----- Backend -----
Write-Host "Installing backend dependencies..."
cd .\backend\
npm install
npm install --save-dev jest supertest @babel/preset-env @babel/preset-react babel-jest

cd ..

# ----- Cypress (E2E) -----
Write-Host "Installing Cypress..."
npm install --save-dev cypress

# ----- Confirm Node and npm versions -----
Write-Host "Checking Node.js and npm versions..."
node -v
npm -v

Write-Host "`nSetup complete! You can now run:"
Write-Host "Frontend: cd signing-bee ; npm start"
Write-Host "Backend: cd backend ; npm start"
Write-Host "Frontend tests: cd signing-bee ; npm test"
Write-Host "Backend tests: cd backend ; npm test"
Write-Host "Cypress E2E tests: npx cypress open (from repo root)"
