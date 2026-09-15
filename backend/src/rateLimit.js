const buckets = new Map();

export function rateLimit({ windowMs = 60000, max = 100 } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || "unknown";
    const current = buckets.get(key);

    if (!current || now - current.start >= windowMs) {
      buckets.set(key, { start: now, count: 1 });
      return next();
    }

    current.count++;
    if (current.count > max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later."
      });
    }
    next();
  };
}
