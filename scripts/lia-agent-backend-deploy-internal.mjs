import { cp, mkdir } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const sourceDir = path.join(repoRoot, 'backend', 'lia-agent');
const targetDir = '/opt/lia-agent-backend';
const serviceName = 'lia-agent-backend';
const host = '127.0.0.1';
const port = 3014;
const deployGate = 'DEPLOY_LIA_AGENT_INTERNAL_READONLY_V440E';

function printResult(result, exitCode = 0) {
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = exitCode;
}

async function run(command, args, options = {}) {
  try {
    const result = await execFileAsync(command, args, {
      timeout: options.timeout ?? 15000,
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

function requestLocal(pathname, options = {}) {
  return new Promise((resolve) => {
    const request = http.request(
      {
        host,
        port,
        path: pathname,
        method: options.method || 'GET',
        timeout: 1200,
      },
      (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          resolve({
            ok: true,
            statusCode: response.statusCode || 0,
            body,
          });
        });
      },
    );

    request.on('timeout', () => {
      request.destroy(new Error('request_timeout'));
    });
    request.on('error', (error) => {
      resolve({ ok: false, statusCode: 0, body: '', error: error.message });
    });
    request.end();
  });
}

async function getPortLines() {
  const result = await run('ss', ['-ltnp']);
  if (!result.ok) return [];

  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes(`:${port}`));
}

if (process.env.LIA_AGENT_DEPLOY_INTERNAL_GATE !== deployGate) {
  printResult(
    {
      ok: false,
      mode: 'deploy_internal_readonly',
      deployed: false,
      pm2StartedOrRestarted: false,
      healthOk: false,
      publicExposed: false,
      pm2SaveRequired: false,
      reason: 'deploy_gate_required',
    },
    1,
  );
} else {
  const deployResult = {
    ok: false,
    mode: 'deploy_internal_readonly',
    deployed: false,
    pm2StartedOrRestarted: false,
    healthOk: false,
    publicExposed: false,
    pm2SaveRequired: true,
    checks: [],
  };

  try {
    await mkdir(targetDir, { recursive: true });
    await cp(sourceDir, targetDir, {
      recursive: true,
      force: true,
      filter: (source) => {
        const base = path.basename(source);
        return base !== '.git' && base !== '.env';
      },
    });
    deployResult.deployed = true;
    deployResult.checks.push({ id: 'files-copied', passed: true });

    const selfCheck = await run(process.execPath, ['self-check.mjs'], { cwd: targetDir });
    deployResult.checks.push({ id: 'self-check', passed: selfCheck.ok });
    if (!selfCheck.ok) throw new Error('self_check_failed');

    const existingProcess = await getPm2Process();
    const serviceEnv = {
      ...process.env,
      LIA_AGENT_HOST: host,
      LIA_AGENT_PORT: String(port),
    };

    const pm2Action = existingProcess
      ? await run('pm2', ['restart', serviceName, '--update-env'], { cwd: targetDir, env: serviceEnv })
      : await run('pm2', ['start', 'server.mjs', '--name', serviceName, '--interpreter', 'node'], {
          cwd: targetDir,
          env: serviceEnv,
        });
    deployResult.pm2StartedOrRestarted = pm2Action.ok;
    deployResult.checks.push({ id: 'pm2-service-aligned', passed: pm2Action.ok });
    if (!pm2Action.ok) throw new Error('pm2_action_failed');

    const health = await requestLocal('/health');
    let healthBody = null;
    try {
      healthBody = JSON.parse(health.body);
    } catch {
      healthBody = null;
    }
    deployResult.healthOk = health.statusCode === 200 && healthBody?.ok === true;
    deployResult.checks.push({ id: 'health-local-ok', passed: deployResult.healthOk });

    const portLines = await getPortLines();
    const localLinePresent = portLines.some((line) => line.includes(`${host}:${port}`));
    deployResult.publicExposed = portLines.some((line) => line.includes(`:${port}`) && !line.includes(`${host}:${port}`));
    deployResult.checks.push({ id: 'ss-local-only', passed: localLinePresent && deployResult.publicExposed === false });

    deployResult.ok = deployResult.checks.every((check) => check.passed);
    printResult(deployResult, deployResult.ok ? 0 : 1);
  } catch (error) {
    deployResult.error = error.message;
    deployResult.ok = false;
    printResult(deployResult, 1);
  }
}
