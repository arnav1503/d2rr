import express, { type Express } from 'express';
import { createServer, type Server } from 'http';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server } },
    appType: 'custom',
    root: path.resolve(__dirname, '../client'),
  });
  app.use(vite.middlewares);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, '../dist/public');
  if (!fs.existsSync(distPath)) {
    app.use(express.static(path.resolve(__dirname, '../client')));
  } else {
    app.use(express.static(distPath));
    app.use('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }
}

export function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  console.log(`[${formattedTime}] ${message}`);
}
