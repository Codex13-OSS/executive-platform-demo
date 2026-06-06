import { access, constants } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const backendDir = path.join(repoRoot, 'backend', 'lia-agent');
const backendServer = path.join(backendDir, 'server.mjs');
const backendPackage = path.join(backendDir, 'package.json');
const serverRepoPath = '/opt/executive-platform-demo';
const serviceName = 'lia-agent-backend';
const backendPort = 3014;
const checks = [];

function addCheck(id, passed, detail, extra = {}) {
  checks.push({ id, passed, detail, ...extra });
}

async function exists(targetPath) {
  try {
    await access(targetPath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function run(command, args, options = {}) {
  try {
    const result = await execFileAsync(command, args, {
      timeout: options.timeout ?? 2500,
      maxBuffer: 1024 * 1024,
      cwd: options.cwd,
      env: options.env,
    });

    return {
      ok: true,
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim(),
    };
  } catch (error) {
    return {
      ok: false,
      stdout: error.stdout?.toString().trim() || '',
      stderr: error.stderr?.toString().trim() || error.message,
      code: error.code,
    };
  }
}

async function getPm2Process() {
  const result = await run('pm2', ['jlist']);
  if (!result.ok) return null;

  try {
    const list = JSON.parse(result.stdout || '[]');
    return list.find((item) => item?.name === serviceName) ?? null;
  } catch {
    return null;
  }
}

async function getPortLines() {
  const result = await run('ss', ['-ltnp']);
  if (!result.ok) return [];

  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes(`:${backendPort}`));
}

addCheck('repo-root-exists', await exists(repoRoot), 'Repository root exists.', { path: repoRoot });
addCheck('backend-dir-exists', await exists(backendDir), 'backend/lia-agent exists.', { path: backendDir });
addCheck('backend-server-exists', await exists(backendServer), 'backend server exists.', { path: backendServer });
addCheck('backend-package-exists', await exists(backendPackage), 'backend package exists.', { path: backendPackage });

const nodeVersion = await run(process.execPath, ['--version']);
addCheck('node-available', nodeVersion.ok, 'Node is available.', { version: nodeVersion.stdout || null });

const pm2Version = await run('pm2', ['--version']);
addCheck('pm2-available', pm2Version.ok, 'PM2 command is available.', { version: pm2Version.stdout || null });

const portLines = await getPortLines();
const pm2Process = await getPm2Process();
const portFree = portLines.length === 0;
const portOwnedByService = !portFree && pm2Process?.name === serviceName;
addCheck(
  'backend-port-safe',
  portFree || portOwnedByService,
  portFree ? 'Port 3014 is free.' : 'Port 3014 is already aligned with lia-agent-backend.',
  { port: backendPort, listeners: portLines },
);

addCheck(
  'server-repo-path-exists',
  await exists(serverRepoPath),
  'Server repo path exists when running on the internal server.',
  { path: serverRepoPath },
);

const result = {
  ok: checks.every((check) => check.passed),
  mode: 'preflight',
  checks,
};

console.log(JSON.stringify(result, null, 2));
