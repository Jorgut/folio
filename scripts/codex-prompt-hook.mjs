#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let prompt;
try {
  prompt = JSON.parse(readFileSync(0, 'utf8')).prompt;
} catch {
  process.exit(0);
}

// Only explicit skill calls trigger the hook, not ordinary discussion of Folio.
if (typeof prompt !== 'string' || !/^\s*(?:\/folio|\$folio|\[\$folio\])(?=\s|$|[([?!.,])/i.test(prompt)) {
  process.exit(0);
}

const checker = path.join(path.dirname(fileURLToPath(import.meta.url)), 'check-update.mjs');
const result = spawnSync(process.execPath, [checker], { encoding: 'utf8', timeout: 15000 });
const status = result.error
  ? `Folio update check could not run: ${result.error.message}`
  : (result.stdout || result.stderr || 'Folio update check returned no result').trim();
const instruction = result.status === 10
  ? 'Tell the user about the available version and ask for permission before running self-update.mjs. Continue the requested Folio work meanwhile.'
  : 'Continue the requested Folio work. Never claim an update succeeded merely because a check ran.';

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: `${status.slice(0, 4000)}\n${instruction}`,
  },
}));
