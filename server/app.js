const express = require("express");
const path = require("path");
// Load env from server/.env then fallback to project root .env
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const bcrypt = require("bcryptjs");
const fileUpload = require("express-fileupload");
const productsRouter = require("./routes/products");
const productImagesRouter = require("./routes/productImages");
const categoryRouter = require("./routes/category");
const searchRouter = require("./routes/search");
const mainImageRouter = require("./routes/mainImages");
const userRouter = require("./routes/users");
const orderRouter = require("./routes/customer_orders");
const slugRouter = require("./routes/slugs");
const orderProductRouter = require("./routes/customer_order_product");
// const wishlistRouter = require('./routes/wishlist');
const notificationsRouter = require("./routes/notifications");
const merchantRouter = require("./routes/merchant"); // Add this line
const bulkUploadRouter = require("./routes/bulkUpload");
var cors = require("cors");

// Import logging middleware
const {
  addRequestId,
  requestLogger,
  errorLogger,
  securityLogger,
} = require("./middleware/requestLogger");

// Opsi: prioritaskan DISABLE_RATE_LIMIT daripada environment
const disableRateLimit = process.env.DISABLE_RATE_LIMIT === "true";
const isTestEnvironment =
  !disableRateLimit &&
  (process.env.NODE_ENV === "test" || process.env.CYPRESS_TEST === "true");

// Conditional import berdasarkan environment
let rateLimiters;
if (isTestEnvironment) {
  console.log("🧪 Using relaxed rate limiters for testing environment");
  // Check if test rate limiter file exists, otherwise use regular ones
  try {
    rateLimiters = require("./middleware/rateLimiter.test");
  } catch (err) {
    console.warn(
      "⚠️  Test rate limiter not found, using regular rate limiters"
    );
    rateLimiters = require("./middleware/rateLimiter");
  }
} else {
  console.log("🔒 Using production rate limiters");
  rateLimiters = require("./middleware/rateLimiter");
}

const {
  generalLimiter,
  authLimiter,
  registerLimiter,
  userManagementLimiter,
  uploadLimiter,
  searchLimiter,
  orderLimiter,
} = rateLimiters;

const { handleServerError } = require("./utills/errorHandler");

const app = express();

// Trust proxy for accurate IP addresses
app.set("trust proxy", 1);

// Add request ID to all requests
app.use(addRequestId);

// Security logging (check for suspicious patterns)
app.use(securityLogger);

// Standard request logging
app.use(requestLogger);

// Error logging (only logs 4xx and 5xx responses)
app.use(errorLogger);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.NEXTAUTH_URL,
  process.env.FRONTEND_URL,
].filter(Boolean); // Remove undefined values

// CORS configuration with origin validation
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, Cypress)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (
      process.env.NODE_ENV === "development" &&
      origin.startsWith("http://localhost:")
    ) {
      return callback(null, true);
    }

    // Allow all localhost in development/test
    if (
      (process.env.NODE_ENV === "development" || isTestEnvironment) &&
      origin.startsWith("http://localhost:")
    ) {
      return callback(null, true);
    }

    const msg =
      "The CORS policy for this site does not allow access from the specified Origin.";
    return callback(new Error(msg), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Tambahkan OPTIONS & PATCH
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Tambahkan header tambahan
  credentials: true,
  preflightContinue: false, // Important: Handle preflight properly
  optionsSuccessStatus: 204, // Some legacy browsers choke on 204
};

// Apply CORS BEFORE rate limiters
app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(fileUpload());

// Apply general rate limiting to all routes
if (!disableRateLimit) {
  // Apply general rate limiting to all routes
  app.use(generalLimiter);

  // Apply specific rate limiters
  app.use("/api/users", userManagementLimiter);
  app.use("/api/search", searchLimiter);
  app.use("/api/orders", orderLimiter);
  app.use("/api/order-product", orderLimiter);
  app.use("/api/images", uploadLimiter);
  app.use("/api/main-image", uploadLimiter);
  app.use("/api/bulk-upload", uploadLimiter);
  app.use("/api/users/email", authLimiter);
} else {
  console.log("⚠️  Rate limiting DISABLED via DISABLE_RATE_LIMIT=true");
}

// Apply admin rate limiting to admin routes

app.use("/api/products", productsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/images", productImagesRouter);
app.use("/api/main-image", mainImageRouter);
app.use("/api/users", userRouter);
app.use("/api/search", searchRouter);
app.use("/api/orders", orderRouter);
app.use("/api/order-product", orderProductRouter);
app.use("/api/slugs", slugRouter);
// app.use("/api/wishlist", wishlistRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/merchants", merchantRouter);
app.use("/api/bulk-upload", bulkUploadRouter);

// Health check endpoint (no rate limiting)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    testMode: isTestEnvironment,
    timestamp: new Date().toISOString(),
    rateLimiting: "enabled",
    requestId: req.reqId,
  });
});

// Rate limit info endpoint
app.get("/rate-limit-info", (req, res) => {
  const limits = isTestEnvironment
    ? {
        general: "1000 requests per 15 minutes (TEST MODE)",
        auth: "500 login attempts per 15 minutes (TEST MODE)",
        note: "Relaxed limits for testing",
      }
    : {
        general: "100 requests per 15 minutes",
        auth: "5 login attempts per 15 minutes",
        register: "3 registrations per hour",
        upload: "10 uploads per 15 minutes",
        search: "30 searches per minute",
        orders: "15 order operations per 15 minutes",
      };

  res.status(200).json({
    ...limits,
    requestId: req.reqId,
  });
});
// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    requestId: req.reqId,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  handleServerError(err, res, `${req.method} ${req.path}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Test mode: ${isTestEnvironment ? "ENABLED" : "DISABLED"}`);

  if (disableRateLimit) {
    console.log("❌ Rate limiting is DISABLED (DISABLE_RATE_LIMIT=true)");
  } else {
    console.log(
      "✅ Rate limiting and request logging enabled for all endpoints"
    );
  }

  console.log("Logs are being written to server/logs/ directory");
});
