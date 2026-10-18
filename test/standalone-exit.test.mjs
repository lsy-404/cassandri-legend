import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const runtime = await readFile(join(root, 'game.js'), 'utf8');
const styles = await readFile(join(root, 'styles.css'), 'utf8');

test('exit links point to the host home-url meta and disappear without one', () => {
  assert.ok(runtime.includes(`const homeUrl=document.querySelector('meta[name="home-url"]')?.content;`), 'The game must read the home-url meta.');
  assert.ok(runtime.includes('if(homeUrl){for(const link of document.querySelectorAll(".portal-exit,.settings-exit"))link.href=homeUrl;}'), 'Both exit links must point to the home URL.');
  assert.ok(runtime.includes(String.raw`else{document.documentElement.classList.add("standalone");document.title=document.title.replace(/ \| Tiny Projects$/,"");}`), 'Without a home URL the page must be standalone and drop the Tiny Projects title suffix.');
  assert.ok(styles.includes('html.standalone #settingsOverlay .settings-exit,html.standalone #welcomeOverlay .portal-exit{display:none;}'), 'Standalone pages must hide both exit links.');
});
