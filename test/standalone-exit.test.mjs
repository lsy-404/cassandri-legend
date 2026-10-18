import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const runtime = await readFile(join(root, 'game.js'), 'utf8');
const styles = await readFile(join(root, 'styles.css'), 'utf8');

test('exit links and the Tiny Projects title only show under the Tiny /games/ path', () => {
  assert.ok(runtime.includes(String.raw`if(!/^\/games\//.test(location.pathname)){document.documentElement.classList.add("standalone");`), 'Outside /games/ the page must be marked standalone.');
  assert.ok(runtime.includes(String.raw`document.title=document.title.replace(/ \| Tiny Projects$/,"");`), 'Outside /games/ the title must drop the Tiny Projects suffix.');
  assert.ok(styles.includes('html.standalone #settingsOverlay .settings-exit,html.standalone #welcomeOverlay .portal-exit{display:none;}'), 'Standalone pages must hide both exit links.');
});
