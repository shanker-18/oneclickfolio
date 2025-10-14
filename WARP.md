# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Frontend: React 19 + Vite app in src/, with client-side routing (react-router-dom) and Tailwind CSS classes.
- Backend: Express server in server/ with MongoDB (Mongoose), file uploads (multer), PDF parsing + AI extraction (Gemini), and REST endpoints under /api and /api/auth.
- Local dev flow: Run the Vite dev server and the Express API server together. The client uses http://localhost:5000 in development and a deployed API URL in production.

Common commands
- Install dependencies
  - Frontend (repo root):
    - npm install
  - Backend (server/):
    - npm install

- Run development servers (in two terminals)
  - Frontend (Vite, defaults to http://localhost:5173):
    - npm run dev
  - Backend (Express + nodemon, defaults to http://localhost:5000):
    - npm run dev --prefix server

- Build frontend
  - npm run build
  - Preview build locally (static preview):
    - npm run preview

- Lint (ESLint 9, flat config)
  - npm run lint

- Backend (production start)
  - npm run start --prefix server

- Tests
  - No formal test runner is configured. There are ad-hoc scripts in server/ (e.g., test-extraction.js, test-dynamic-extraction.js). Run them directly, e.g.:
    - node server/test-extraction.js

Environment and configuration
- Frontend API base URL: src/config/api.js
  - Development: http://localhost:5000
  - Production: uses a deployed API URL (hardcoded) when import.meta.env.PROD is true.
- Backend environment variables (server/.env):
  - MONGODB_URI: MongoDB connection string (Atlas/local)
  - FRONTEND_URL: Allowed origin for CORS (e.g., http://localhost:5173 or the deployed frontend URL)
  - PORT: Optional (defaults to 5000)

High-level architecture
- Frontend
  - Entry: src/main.jsx renders App to #root.
  - Routing: src/App.jsx defines routes with react-router-dom.
    - Public: /login, /public/:slug
    - Protected: /, /dashboard, /create, /portfolio/:portfolioId guarded by ProtectedRoute which checks AuthContext.isAuthenticated.
  - Auth/session: src/context/AuthContext.jsx
    - Stores sessionId in localStorage after /api/auth/login.
    - Validates session via /api/auth/session/:sessionId at app load.
    - Provides login() and logout() helpers and exposes isAuthenticated and loading.
  - API configuration: src/config/api.js
    - Sets API_BASE_URL based on Vite env (development vs production) and is used to set axios.defaults.baseURL.
  - Data access: src/services/portfolioService.js wraps calls to:
    - POST /api/user/:sessionId/portfolio (multipart) to create a portfolio from a PDF.
    - GET/PUT/DELETE endpoints for portfolios and publishing.
  - UI composition: src/components/
    - Dashboard, PortfolioCreator, PortfolioDisplay, PDFUpload, and section components (Education, Experience, Skills, etc.).
    - Template rendering via src/components/templates/TemplateRenderer.jsx which maps templateKey to concrete templates (Classic, Modern, Elegant, Minimal, Creative, Tech, Professional, etc.).
  - Theming: src/utils/themes.js defines theme palettes and helpers consumed by templates.

- Backend
  - Server: server/index.js
    - Express app with CORS configured (whitelist + permissive in development).
    - JSON and URL-encoded payloads (50mb limits).
    - Static file serving for /uploads.
    - Health endpoint at /health.
    - Skips app.listen when running on Vercel (exports handler) for serverless deployment compatibility.
  - Routes
    - /api/auth (server/routes/auth.js): login (creates/updates user and issues sessionId), session validation, logout.
    - /api (server/routes/portfolio.js):
      - POST /user/:sessionId/portfolio (multipart PDF) parses the PDF, extracts content using pdfProcessor + Gemini (geminiAI), refines the structure, stores Portfolio in MongoDB, and generates a URL slug.
      - Additional endpoints for CRUD and publishing (see route file).
  - Middleware
    - File uploads: server/middleware/upload.js (PDF in-memory; images saved to uploads/ with timestamped filenames).
    - Error handling: server/middleware/errorHandler.js.
  - Persistence
    - Mongoose models (server/models/User.js, server/models/Portfolio.js).
    - MongoDB connection via mongoose.connect (server/index.js). A separate Database helper exists in server/utils/database.js, but index.js currently connects directly.

Local development tips specific to this repo
- Run both servers together during development. The frontend will call http://localhost:5000 by default.
- If CORS blocks a request during development, confirm FRONTEND_URL in server/.env matches the frontend origin (e.g., http://localhost:5173) or rely on the development-permissive path in server/index.js.
- Uploaded images are written to server/uploads/ and served at /uploads/* from the API server.

Notes from existing docs
- README.md is the default Vite template and does not include project-specific commands beyond those listed here.
