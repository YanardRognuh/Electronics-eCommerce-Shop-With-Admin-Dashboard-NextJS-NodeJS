// server/middleware/rateLimiter.test.js
const rateLimit = require("express-rate-limit");

console.log("📝 Loading TEST rate limiters (relaxed limits)");

// Relaxed rate limiters for testing
const createTestLimiter = (windowMs, max, name) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for requests from Cypress
      const userAgent = req.get("User-Agent") || "";
      return userAgent.includes("Cypress");
    },
    handler: (req, res) => {
      console.warn(`⚠️  Rate limit hit for ${name}: ${req.ip}`);
      res.status(429).json({
        error: `Too many requests for ${name}`,
        retryAfter: Math.ceil(windowMs / 60000) + " minutes",
      });
    },
  });
};

module.exports = {
  generalLimiter: createTestLimiter(15 * 60 * 1000, 1000, "general"),
  authLimiter: createTestLimiter(15 * 60 * 1000, 500, "auth"),
  registerLimiter: createTestLimiter(60 * 60 * 1000, 100, "register"),
  userManagementLimiter: createTestLimiter(
    15 * 60 * 1000,
    1000,
    "user management"
  ),
  uploadLimiter: createTestLimiter(15 * 60 * 1000, 500, "upload"),
  searchLimiter: createTestLimiter(1 * 60 * 1000, 500, "search"),
  orderLimiter: createTestLimiter(15 * 60 * 1000, 500, "order"),
};
