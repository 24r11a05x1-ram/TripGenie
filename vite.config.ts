import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleGenerateItinerary, handleModifyItinerary, handleGetWeather, handleGetDemoTrip } from './server/apiRouter.ts';

function apiMiddlewarePlugin(): Plugin {
  return {
    name: 'tripgenie-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = url.pathname;

        // Collect body for POST requests
        let body: any = {};
        if (req.method === 'POST') {
          const chunks: any[] = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const raw = Buffer.concat(chunks).toString();
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch (e) {
            body = {};
          }
        }

        // Fake Express-like req/res adapters
        const expressReq: any = {
          body,
          query: Object.fromEntries(url.searchParams.entries()),
          params: {},
          headers: req.headers,
        };

        const expressRes: any = {
          status(code: number) {
            res.statusCode = code;
            return this;
          },
          json(data: any) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return this;
          },
          send(data: any) {
            res.end(data);
            return this;
          },
        };

        if (pathname === '/api/generate-itinerary' && req.method === 'POST') {
          return handleGenerateItinerary(expressReq, expressRes);
        } else if (pathname === '/api/modify-itinerary' && req.method === 'POST') {
          return handleModifyItinerary(expressReq, expressRes);
        } else if (pathname === '/api/weather' && req.method === 'GET') {
          return handleGetWeather(expressReq, expressRes);
        } else if (pathname === '/api/demo-trip' && req.method === 'GET') {
          return handleGetDemoTrip(expressReq, expressRes);
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMiddlewarePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
