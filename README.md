# Signing Bee
ASL learning platform incorporating real-time gesture recognition.
<br>
[<b>signingbee.xyz</b>](signingbee.xyz)

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

From the project root, run:
```
cd frontend && npm i
```

And again from the project root, run:
```
cd backend && npm i
```

### 3. **Run the development server**
- Start the frontend:
```
cd frontend && npm start
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
