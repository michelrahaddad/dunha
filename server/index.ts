import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import path from "path";

const app = express();

// Basic middleware for Render
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client/dist FIRST
app.use(express.static(path.join(process.cwd(), 'client/dist')));

(async () => {
  try {
    // Register API routes first
    const server = await registerRoutes(app);
    
    // Serve React app for all non-API routes
    app.get('*', (req, res) => {
      // Skip API routes and health check
      if (req.path.startsWith('/api/') || req.path === '/health' || req.path.includes('.zip')) {
        return;
      }
      res.sendFile(path.join(process.cwd(), 'client/dist/index.html'));
    });

    // Error handler
    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      res.status(500).json({ error: "Internal Server Error" });
    });

    // Start server on Render port
    const port = parseInt(process.env.PORT || '10000');
    server.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
      console.log(`Frontend: http://0.0.0.0:${port}/`);
      console.log(`Health check: http://0.0.0.0:${port}/health`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
