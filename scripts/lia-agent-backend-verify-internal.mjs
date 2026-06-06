import { execFile } from 'node:child_process';
import http from 'node:http';
import { access, constants } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const serviceName = 'lia-agent-backend';
const host = '127.0.0.1';
const port = 3014;
const publicHost = '38.242.222.25';
const checks = [];
const evidence = {
  pm2Status: null,
  healthOk: false,
  postStatus: null,
  notFoundStatus: null,
  publicReachable: null,
  ssLocalOnly: false,
  frontend3004Status: null,
  htmlDemo3020Status: null,
};

function addCheck(id, passed, detail, extra = {}) {
  checks.push({ id, passed, detail, ...extra });
}

async function run(command, args, options = {}) {
  try {
    const result = await execFileAsync(command, args, {
      timeout: options.timeout ?? 5000,
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

async function exists(targetPath) {
  try {
    await access(targetPath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function requestHttp(targetHost, targetPort, pathname, options = {}) {
  return new Promise((resolve) => {
    const request = http.request(
      {
        host: targetHost,
        port: targetPort,
        path: pathname,
        method: options.method || 'GET',
        timeout: options.timeout ?? 1500,
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

async function getPm2Process(name) {
  const result = await run('pm2', ['jlist']);
  if (!result.ok) return null;

  try {
    const list = JSON.parse(result.stdout || '[]');
    return list.find((item) => item?.name === name) ?? null;
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
    .filter((line) => line.includes(`:${port}`));
}

const pm2Process = await getPm2Process(serviceName);
evidence.pm2Status = pm2Process?.pm2_env?.status ?? null;
addCheck('pm2-online', evidence.pm2Status === 'online', 'PM2 service is online.', { status: evidence.pm2Status });

const health = await requestHttp(host, port, '/health');
let healthBody = null;
try {
  healthBody = JSON.parse(health.body);
} catch {
  healthBody = null;
}
evidence.healthOk = health.statusCode === 200 && healthBody?.ok === true;
addCheck('health-ok', evidence.healthOk, 'GET local health is OK.', { statusCode: health.statusCode });

const postHealth = await requestHttp(host, port, '/health', { method: 'POST' });
evidence.postStatus = postHealth.statusCode;
addCheck('post-405', postHealth.statusCode === 405, 'POST local health returns 405.', { statusCode: postHealth.statusCode });

const notFound = await requestHttp(host, port, '/not-found');
evidence.notFoundStatus = notFound.statusCode;
addCheck('not-found-404', notFound.statusCode === 404, 'Unknown local route returns 404.', { statusCode: notFound.statusCode });

const publicHealth = await requestHttp(publicHost, port, '/health', { timeout: 1800 });
evidence.publicReachable = publicHealth.ok && publicHealth.statusCode > 0;
addCheck('public-port-closed', evidence.publicReachable === false, 'Public address does not answer on backend port.');

const portLines = await getPortLines();
const localLinePresent = portLines.some((line) => line.includes(`${host}:${port}`));
const nonLocalLinePresent = portLines.some((line) => line.includes(`:${port}`) && !line.includes(`${host}:${port}`));
evidence.ssLocalOnly = localLinePresent && !nonLocalLinePresent;
addCheck('ss-local-only', evidence.ssLocalOnly, 'ss shows backend bound only to localhost.', { listeners: portLines });

const frontend = await requestHttp(host, 3004, '/', { timeout: 1200 });
evidence.frontend3004Status = frontend.statusCode;
addCheck('frontend-3004-local-200', frontend.statusCode === 200, 'Frontend responds locally on 3004.', { statusCode: frontend.statusCode });

const htmlDemoExists = (await exists('/opt/html-demo')) || Boolean(await getPm2Process('html-demo'));
if (htmlDemoExists) {
  const htmlDemo = await requestHttp(host, 3020, '/', { timeout: 1200 });
  evidence.htmlDemo3020Status = htmlDemo.statusCode;
  addCheck('html-demo-3020-local-200', htmlDemo.statusCode === 200, 'html-demo responds locally on 3020.', { statusCode: htmlDemo.statusCode });
} else {
  evidence.htmlDemo3020Status = 'not_present';
  addCheck('html-demo-3020-optional', true, 'html-demo not present; optional check skipped.');
}

const result = {
  ok: checks.every((check) => check.passed),
  checks,
  evidence,
};

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exitCode = 1;
}
