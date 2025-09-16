# Signing Bee
ASL learning game site with gesture recognition.

PFW Fall 2025
<br>
CS53701 Full-Stack Web Development
<br>
Term Project

- Harrison Niswander
- Ricardo Saldana-Cervantes
- Steven LaGoy
- Zach McGill

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Available Commands](#available-commands)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Testing**: Jest (unit & integration), Supertest (API), Cypress (E2E)
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (Hobby tier)

---

## Requirements
- Node.js >= 18
- npm >= 9
- PostgreSQL
- Git
- Chrome or another Cypress-supported browser

---

## Getting Started

### 1. **Clone the repository**
```bash
git clone https://github.com/<your-username>/Signing-Bee.git
cd Signing-Bee/signing-bee
```

### 2. **Install dependencies**
Make sure you have [**Node.js**](https://nodejs.org/en/download/) (>=18) installed.

Use the setup scripts to download other dependencies.

#### Windows (Powershell)

1. Open **Powershell** as an administrator.
2. Navigate to the repository root:
```powershell
cd C:\path\to\Signing-Bee
```
3. Run the setup script with temporary execution policy bypass
```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```
This will install frontend and backend dependencies, Jest, Supertest, and Cypress.

#### Linux / macOS (Bash)

1. Open a terminal and navigate to the repository root:
```bash
cd /path/to/Signing-Bee
```
2. Make the script executable:
```bash
chmod +x setup.sh
```
3. Run the script:
```bash
./setup.sh
```
This will install frontend and backend dependencies, Jest, Supertest, and Cypress.

### 3. **Run the development server**
- Start the frontend:
```
cd signing-bee && npm start
```
- Start the backend:
```
cd backend && npm start
```
This will launch the app on [http://localhost:3000](http://localhost:3000) in your default browser.

---

### Additional Commands
* Build for production

    ```
    npm run build
    ```

    Creates and optimized production build in the `build/` folder.

* Run tests

    Open the page on localhost:3000 (see **3. Run the Development server**). Then open a new console.

    - Unit tests (Jest + Supertest)
    
        Install Jest:
    
        ```
        npm install --save-dev jest
        ```
    
        To test frontend:
        ```
        cd signing-bee && npm test
        ```
        To test backend:
        ```
        cd backend && npm test
        ```
    
    - End-to-end tests (Cypress)
        
        Install Cypress:
        
        ```
        npx install cypress --save-dev
        ```

        And open Cypress with:
        
        ```
        npx cypress open
        ```

        Or run headless with:

        ```
        npx cypress run
        ```
    
        Select "E2E Testing", "Chrome", "Start Testing in Chrome". Then select a page to test. Cypress E2E tests will be run automatically. To finish testing, close the console or interrupt the process with CTRL+C.

* Lint & format

    ```npm run lint```

    ```npm run format```

* CI/CD

    Github Actions is configured to:
    - Install dependencies
    - Run Jest + Supertest tests
    - Run Cypress E2E tests
    Workflow triggers on pushes or pull requiests to any branch.
    Vercel handles automatic deployment from `main` branch.