# Production-Ready Capstone — Task 05

Full-stack internship portal upgraded for production-readiness.

## Included
- Vite frontend + Express API
- SQLite prepared statements
- Client/server validation
- Helmet security headers
- CORS
- API rate limiting
- Request logging
- `/api/health` and `/api/ready`
- Loading, success, empty and retry/error states
- Responsive/mobile UI
- Accessible labels, focus states and live status messages
- Automated regression tests
- Security/accessibility/performance checklists
- Dockerfile + Render deployment config
- Submission notes and walkthrough checklist

## Local run

Terminal 1:
```bash
cd backend
npm install
npm run dev
```

Terminal 2:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Regression tests
```bash
cd backend
npm test
```

## Production build
```bash
cd frontend
npm run build
cd ../backend
npm start
```

The backend serves `frontend/dist` after the production build.

## Deployment
`render.yaml` and `Dockerfile` are included. A real production deployment should use HTTPS and a persistent managed database instead of local SQLite.

## EdVyro
Use the public GitHub repository as the proof link. Record a short walkthrough and put its URL in `docs/submission.md`.
