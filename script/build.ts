import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runBuild() {
  await build({
    entryPoints: [path.resolve(__dirname, '../server/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'esm',
    outfile: path.resolve(__dirname, '../dist/index.js'),
    external: ['express', 'vite'],
  });
}

runBuild().catch(console.error);
