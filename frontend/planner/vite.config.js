import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs';

// https://vite.dev/config/
export default defineConfig(({mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_START_')

  return {
    plugins: [react()],
    server: {
      https: {
        key: fs.readFileSync(env.VITE_START_HTTPS_KEY),
        cert: fs.readFileSync(env.VITE_START_HTTPS),
      },
      host: env.VITE_START_HOST,
      port: env.VITE_START_PORT,
    }
  }
})
