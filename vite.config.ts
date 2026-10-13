import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

// Vercel runs the functions in api/ in production. This serves the same files during
// `vite dev`, so the live try-on also works on localhost.
function devApiRoutes(): Plugin {
  return {
    name: 'dev-api-routes',
    configureServer(server) {
      server.middlewares.use('/api/realtime-token', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/realtime-token.ts');
          const handler = mod[req.method ?? 'GET'];
          if (typeof handler !== 'function') {
            res.statusCode = 405;
            res.end();
            return;
          }
          const response: Response = await handler(new Request(`http://localhost${req.url}`, {method: req.method}));
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(await response.text());
        } catch (err) {
          server.config.logger.error(`api/realtime-token failed: ${err}`);
          res.statusCode = 500;
          res.end();
        }
      });
    },
  };
}

export default defineConfig(({mode}) => {
  // Server-only secrets (no VITE_ prefix) from .env.local, for the dev API routes above.
  const {DECART_API_KEY} = loadEnv(mode, __dirname, '');
  if (DECART_API_KEY && !process.env.DECART_API_KEY) process.env.DECART_API_KEY = DECART_API_KEY;

  return {
    plugins: [react(), tailwindcss(), devApiRoutes()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rolldownOptions: {
        // Two pages: the landing page and the try-on shop at /try-on/.
        input: {
          main: path.resolve(__dirname, 'index.html'),
          tryOn: path.resolve(__dirname, 'try-on/index.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
