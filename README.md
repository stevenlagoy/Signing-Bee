# Signing-Bee
ASL learning site with gesture recognition and study regimen.

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/Signing-Bee.git
cd Signing-Bee/signing-bee
```

### 2. Install dependencies
Make sure you have **Node.js** (>=18) and **npm** (>=9) installed.
Then run:
```bash
npm install
```
And check the installation with:
```bash
npm --version
```

### 3. Run the development server
```bash
npm start
```
This will launch the app on [http://localhost:3000](http://localhost:3000) in your default browser.

---

### Additional Commands
* Build for production
```npm run build```
Creates and optimized production build in the `build/` folder.
* Run tests
    - Unit tests (Jest + Supertest)
    ```npm test```
    - End-to-end tests (Cypress)
    ```npx cypress open```

    Or headless:
    
    ```npx cypress run```
* Lint & format

    ```npm run lint```

    ```npm run format```

---

### Tech Stack
* **Frontend:** React
* **Backend:** Node.js + Express
* **Database:** PostgreSQL
* **Testing:** Cypress (E2E), Jest (Unit), Supertest
* **CI/CD:** GitHub Actions
* **Hosting:** Vercel
