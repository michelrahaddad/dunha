import express from "express";
import cors from "cors";
import { createServer } from "http";

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple health endpoints
app.get("/", (req, res) => res.send("OK"));
app.get("/health", (req, res) => res.send("OK"));
app.get("/ping", (req, res) => res.send("pong"));

// Basic API endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({ error: "Internal Server Error" });
});

const port = process.env.PORT || 5000;
const server = createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});