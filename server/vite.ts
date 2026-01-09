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
    server: { 
      middlewareMode: true, 
      hmr: { server },
      allowedHosts: true,
      host: '0.0.0.0',
      port: 5000
    },
    appType: 'custom',
    root: path.resolve(__dirname, '../client'),
  });
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    try {
      // Corrected path to index.html relative to this file
      const template = fs.readFileSync(path.resolve(__dirname, '../client/index.html'), 'utf-8');
      const html = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, '../dist/public');
  if (!fs.existsSync(distPath)) {
    const publicPath = path.resolve(__dirname, '../client');
    app.use(express.static(publicPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(publicPath, 'index.html'));
    });
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
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
