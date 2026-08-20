#!/usr/bin/env node
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PORT = Number(process.env.PORT) || 3000;

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function log(emoji, message, color = colors.reset) {
  const timestamp = getTimestamp();
  console.log(`  ${color}[${timestamp}]${colors.reset} ${emoji} ${message}`);
}

function printHeader() {
  console.log();
  console.log(`${colors.cyan}═════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}  NORDICTECH • Development Server${colors.reset}`);
  console.log(`${colors.cyan}═════════════════════════════════════════════════════════${colors.reset}`);
  console.log();
}

// Anchor the port match so 3000 doesn't also match 13000 / 30001.
async function findListeningPids(port) {
  if (process.platform === 'win32') {
    const { stdout } = await execAsync(
      `netstat -ano | findstr /R ":${port}[^0-9].*LISTENING"`
    ).catch(() => ({ stdout: '' }));

    const pids = new Set();
    for (const line of stdout.trim().split('\n')) {
      if (!line.trim()) continue;
      const parts = line.trim().split(/\s+/);
      const localAddr = parts[1] ?? '';
      const pid = parts[parts.length - 1];
      // Confirm the local address actually ends in :<port>, not just contains it.
      if (localAddr.endsWith(`:${port}`) && /^\d+$/.test(pid)) {
        pids.add(pid);
      }
    }
    return [...pids];
  }

  const { stdout } = await execAsync(`lsof -ti:${port}`).catch(() => ({ stdout: '' }));
  return stdout.trim().split('\n').filter((pid) => /^\d+$/.test(pid));
}

async function killPort(port) {
  log('🔍', `Checking port ${port}...`);

  const pids = await findListeningPids(port);

  if (pids.length > 0) {
    log('⚠️ ', `Port ${port} in use (${pids.length} process${pids.length > 1 ? 'es' : ''}). Cleaning...`, colors.yellow);

    for (const pid of pids) {
      try {
        if (process.platform === 'win32') {
          await execAsync(`taskkill /PID ${pid} /F /T`);
        } else {
          await execAsync(`kill -9 ${pid}`);
        }
        log('🗑️ ', `Killed process ${pid}`, colors.dim);
      } catch (e) {
        log('⚠️ ', `Failed to kill PID ${pid}: ${e.message.split('\n')[0]}`, colors.yellow);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const stillListening = await findListeningPids(port);
  if (stillListening.length > 0) {
    log('❌', `Port ${port} still in use after cleanup`, colors.red);
    process.exit(1);
  }

  log('✅', `Port ${port} is free`, colors.green);
}

function startNext(port) {
  log('🚀', `Starting Next.js on port ${port}...`);
  console.log();

  // `port` is a controlled internal number (env PORT || 3000), never
  // untrusted input, so building a shell string here is safe.
  const next = process.platform === 'win32'
    ? spawn(`npx next dev -p ${port}`, { stdio: 'inherit', shell: true })
    : spawn('npx', ['next', 'dev', '-p', String(port)], { stdio: 'inherit' });

  const forwardSignal = (signal) => {
    next.kill(signal);
  };
  process.on('SIGINT', forwardSignal);
  process.on('SIGTERM', forwardSignal);

  next.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

(async () => {
  printHeader();
  await killPort(PORT);
  console.log();
  startNext(PORT);
})();
