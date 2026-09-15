import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApplication, listApplications } from "./db.js";
import { validateApplication } from "./validation.js";
import { rateLimit } from "./rateLimit.js";
import { logError, logRequest } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, "../../frontend/dist");
const app = express();
const production = process.env.NODE_ENV === "production";

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: production ? true : (process.env.FRONTEND_ORIGIN || "http://localhost:5173"),
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "20kb" }));

app.use((req, res, next) => {
  const started = performance.now();
  res.on("finish", () => logRequest(req, res, performance.now() - started));
  next();
});

app.use("/api", rateLimit());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "production-capstone-api",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/ready", (_req, res) => {
  res.json({ success: true, status: "ready" });
});

app.get("/api/applications", (_req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    res.json({ success: true, data: listApplications() });
  } catch (error) {
    logError(error, _req);
    res.status(500).json({ success: false, message: "Unable to load applications." });
  }
});

app.post("/api/applications", (req, res) => {
  const result = validateApplication(req.body);
  if (!result.valid) {
    return res.status(400).json({
      success: false, message: "Validation failed.", errors: result.errors
    });
  }

  try {
    const created = createApplication(result.data);
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: created
    });
  } catch (error) {
    logError(error, req);
    return res.status(500).json({ success: false, message: "Unable to submit application." });
  }
});

app.use(express.static(frontendDist, { maxAge: production ? "1d" : 0, etag: true }));

app.use((req, res) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.join(frontendDist, "index.html"), (error) => {
      if (error) res.status(404).json({ success: false, message: "Frontend build not found." });
    });
  }
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((error, req, res, _next) => {
  logError(error, req);
  if (error?.type === "entity.too.large")
    return res.status(413).json({ success: false, message: "Request body is too large." });
  if (error instanceof SyntaxError)
    return res.status(400).json({ success: false, message: "Invalid JSON." });
  res.status(500).json({ success: false, message: "Unexpected server error." });
});

export default app;
