export function logRequest(req, res, durationMs) {
  console.log(JSON.stringify({
    time: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    status: res.statusCode,
    durationMs: Number(durationMs.toFixed(2))
  }));
}

export function logError(error, req) {
  console.error(JSON.stringify({
    time: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    error: error?.message || "Unknown error"
  }));
}
