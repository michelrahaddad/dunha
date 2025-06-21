import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();

// Basic middleware for Render
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Detect static files path robustly
const fs = require('fs');
let staticPath: string;

// Try different paths based on environment
const tryPaths = [
  path.join(process.cwd(), 'client', 'dist'),
  path.join(process.cwd(), 'client'),
  path.join(__dirname, '..', 'client', 'dist'),
  path.join(__dirname, '..', 'client'),
  '/opt/render/project/src/client/dist',
  '/opt/render/project/src/client'
];

staticPath = tryPaths.find(p => {
  const indexPath = path.join(p, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log(`✅ Found frontend at: ${p}`);
    return true;
  }
  return false;
}) || path.join(process.cwd(), 'client');

console.log(`📁 Serving static files from: ${staticPath}`);

// Serve static files
app.use(express.static(staticPath));

(async () => {
  try {
    // Register API routes first
    const server = await registerRoutes(app);
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        staticPath,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
      });
    });
    
    // Serve React app for all non-API routes
    app.get('*', (req, res) => {
      // Skip API routes and files
      if (req.path.startsWith('/api/') || 
          req.path === '/health' || 
          req.path.includes('.') && !req.path.endsWith('.html')) {
        return res.status(404).json({ error: 'Not found' });
      }
      
      const indexPath = path.join(staticPath, 'index.html');
      
      if (fs.existsSync(indexPath)) {
        res.sendFile(path.resolve(indexPath));
      } else {
        // Fallback HTML for when build files are missing
        res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cartão + Vidah - Sistema de Benefícios</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .container {
      text-align: center;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.2);
      max-width: 500px;
    }
    .logo { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
    .subtitle { font-size: 1.1rem; opacity: 0.9; margin-bottom: 2rem; }
    .status { 
      background: rgba(255,255,255,0.2); 
      padding: 1rem; 
      border-radius: 10px; 
      margin: 1rem 0;
      font-size: 0.9rem;
    }
    .spinner {
      border: 3px solid rgba(255,255,255,0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 1rem auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Cartão + Vidah</div>
    <div class="subtitle">Sistema de Benefícios de Saúde</div>
    <div class="spinner"></div>
    <div class="status">
      <strong>Sistema Inicializando</strong><br>
      Aguarde enquanto carregamos seus benefícios...
    </div>
    <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 1rem;">
      Consultórios • Farmácias • Laboratórios • Emergências
    </div>
  </div>
  <script>
    setTimeout(() => window.location.reload(), 10000);
  </script>
</body>
</html>
        `);
      }
    });

    // Error handler
    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      console.error('Server Error:', err);
      res.status(500).json({ 
        error: "Internal Server Error",
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    // Start server
    const port = parseInt(process.env.PORT || '10000');
    server.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Cartão + Vidah server running on port ${port}`);
      console.log(`🌐 Frontend: http://0.0.0.0:${port}/`);
      console.log(`❤️  Health: http://0.0.0.0:${port}/health`);
      console.log(`📊 Admin: http://0.0.0.0:${port}/admin/login`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
