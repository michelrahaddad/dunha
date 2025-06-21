import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { securityHeaders, validateRequestSize, monitorSuspiciousActivity, queryTimeout } from "./security";
import { generalLimiter } from "./middleware/rateLimiting";

const app = express();

// Root endpoint for Railway health checks
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Ping endpoint
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "wss:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS with production-safe origins
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? /\.replit\.(app|dev)$/
    : true,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compression for better performance
app.use(compression());

// Trust proxy for accurate client IPs
app.set('trust proxy', 1);

// Additional security middleware
app.use(securityHeaders);
app.use(validateRequestSize);
app.use(monitorSuspiciousActivity);
app.use(queryTimeout(30000)); // 30 second timeout

// Rate limiting is now handled in route modules

// Body parsing with security limits
app.use(express.json({ 
  limit: "10mb",
  verify: (req, res, buf) => {
    if (buf.length > 10 * 1024 * 1024) {
      throw new Error('Request entity too large');
    }
  }
}));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Download route must be before Vite middleware
app.get("/download/cartao-vidah-deploy.zip", (req, res) => {
  const path = require('path');
  const fs = require('fs');
  const filePath = path.join(process.cwd(), 'cartao-vidah-deploy.zip');
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }
  
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="cartao-vidah-deploy.zip"');
  res.download(filePath, 'cartao-vidah-deploy.zip');
});

(async () => {


  // Register API routes FIRST, before Vite middleware
  const server = await registerRoutes(app);
  
  console.log('Rotas API registradas');

  if (app.get('env') === 'development') {
    await setupVite(app, server);
    console.log('Vite middleware configurado');
  } else {
    serveStatic(app);
    console.log('Servindo arquivos estáticos');
  }

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Log error details for monitoring
    console.error(`[Security Alert] ${status} Error on ${req.method} ${req.url}:`, {
      message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: req.body
    });

    // Don't expose internal errors in production
    if (status === 500 && process.env.NODE_ENV === "production") {
      message = "Internal Server Error";
    }

    // Handle different error types securely
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: "Invalid input data" });
    }
    
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ error: "Authentication required" });
    }

    res.status(status).json({ 
      error: message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
  });

  // Vite setup is already handled above

  // Railway uses PORT environment variable
  const port = process.env.PORT || 5000;
  server.listen({
    port: parseInt(port.toString()),
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
    console.log(`Server started on port ${port}`);
    console.log(`Health check available at: http://0.0.0.0:${port}/health`);
  });
})();
