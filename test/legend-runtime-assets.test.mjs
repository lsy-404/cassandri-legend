import { access, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const gameDir = root;
const html = await readFile(join(gameDir, 'index.html'), 'utf8');
const runtime = await readFile(join(gameDir, 'game.js'), 'utf8');
await access(join(gameDir, 'styles.css'));
new vm.Script(runtime, { filename: 'game.js' });
if (!/<link\s+rel="stylesheet"\s+href="\.\/styles\.css">/.test(html)) throw new Error('Cassandri HTML must link styles.css relatively.');
if (!/<script\s+src="\.\/game\.js"><\/script>/.test(html)) throw new Error('Cassandri HTML must load game.js as a classic script.');
if (/<style[\s>]/i.test(html)) throw new Error('Cassandri HTML must not retain inline style blocks.');
if (/<script\s*>/i.test(html)) throw new Error('Cassandri HTML must not retain an inline gameplay script.');
console.log('legend-runtime-assets: passed');
