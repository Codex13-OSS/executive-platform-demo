import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const serviceName = 'lia-agent-backend';
const stopGate = 'STOP_LIA_AGENT_INTERNAL_V440E';
const port = 3014;

function printResult(result, exitCode = 0) {
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = exitCode;
}

async function run(command, args, options = {}) {
  try {
    const result = await execFileAsync(command, args, {
      timeout: options.timeout ?? 8000,
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
    .filter((line) => line.includes(`:${port}`));
}

if (process.env.LIA_AGENT_STOP_INTERNAL_GATE !== stopGate) {
  printResult(
    {
      ok: false,
      mode: 'stop_internal',
      stopped: false,
      portFree: null,
      reason: 'stop_gate_required',
    },
    1,
  );
} else {
  const pm2Process = await getPm2Process();
  let stopped = false;

  if (pm2Process) {
    const stopResult = await run('pm2', ['stop', serviceName]);
    stopped = stopResult.ok;
  }

  const portLines = await getPortLines();
  const portFree = portLines.length === 0;
  const ok = (!pm2Process || stopped) && portFree;

  printResult(
    {
      ok,
      mode: 'stop_internal',
      stopped,
      serviceWasPresent: Boolean(pm2Process),
      portFree,
      targetPreserved: true,
      listeners: portLines,
    },
    ok ? 0 : 1,
  );
}
