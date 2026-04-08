#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    return [key, value ?? 'true'];
  }),
);

const owner = args.get('owner') ?? process.env.UNIFICATION_OWNER ?? 'OsoPanda1';
const targetRepo = args.get('targetRepo') ?? process.env.UNIFICATION_TARGET_REPO ?? 'tamv-digital-nexus';
const maxRepos = Number(args.get('maxRepos') ?? process.env.UNIFICATION_MAX_REPOS ?? 194);
const batchSize = Number(args.get('batchSize') ?? process.env.UNIFICATION_BATCH_SIZE ?? 20);
const apiUrl = args.get('apiUrl') ?? process.env.UNIFICATION_API_URL ?? 'http://127.0.0.1:3001';
const mergeBranch = args.get('mergeBranch') ?? process.env.UNIFICATION_MERGE_BRANCH ?? '';
const dryRun = (args.get('dryRun') ?? process.env.UNIFICATION_DRY_RUN ?? 'true') === 'true';
const reportPath = args.get('report') ?? process.env.UNIFICATION_REPORT_PATH ?? 'unification-report.json';

const shell = (command, cwd) =>
  execSync(command, {
    cwd,
    stdio: 'pipe',
    encoding: 'utf-8',
  });

const sanitizeRemoteName = (raw) => raw.replace(/[^a-zA-Z0-9._-]/g, '-');

const getScript = async () => {
  const endpoint = `${apiUrl}/api/v1/federados/github/unification-script?owner=${encodeURIComponent(owner)}&targetRepo=${encodeURIComponent(targetRepo)}&maxRepos=${maxRepos}&refresh=1`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Unification script request failed (${response.status})`);
  }
  return response.json();
};

const ensureTargetRepo = () => {
  const cwd = process.cwd();
  const currentRepoName = path.basename(cwd);
  if (currentRepoName === targetRepo) {
    return cwd;
  }

  const cloneDir = path.join(cwd, '.unification-workdir', targetRepo);
  fs.mkdirSync(path.dirname(cloneDir), { recursive: true });

  if (!fs.existsSync(cloneDir)) {
    shell(`git clone https://github.com/${owner}/${targetRepo}.git ${cloneDir}`);
  } else {
    shell('git fetch origin --tags', cloneDir);
    shell('git checkout main || git checkout master', cloneDir);
    shell('git pull --ff-only', cloneDir);
  }

  return cloneDir;
};

const executeInBatches = (commands, cwd, currentReport) => {
  let processed = 0;

  while (processed < commands.length) {
    const batch = commands.slice(processed, processed + batchSize);
    for (const command of batch) {
      if (dryRun) {
        currentReport.dryRunCommands.push(command);
        continue;
      }

      try {
        shell(command, cwd);
        currentReport.executed.push(command);
      } catch (error) {
        currentReport.failures.push({
          command,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    processed += batch.length;
  }
};

const run = async () => {
  const payload = await getScript();
  const repoPath = ensureTargetRepo();
  const lines = String(payload.script ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('git '));

  const remoteAdd = lines.filter((line) => line.startsWith('git remote add'));
  const fetches = lines.filter((line) => line.startsWith('git fetch'));
  const remotes = remoteAdd
    .map((line) => {
      const parts = line.split(/\s+/);
      return parts[3] ?? '';
    })
    .filter(Boolean)
    .map(sanitizeRemoteName);

  const report = {
    owner,
    targetRepo,
    maxRepos,
    batchSize,
    dryRun,
    repoPath,
    fetchedScriptLines: lines.length,
    executed: [],
    dryRunCommands: [],
    failures: [],
    merges: [],
    conflicts: [],
    generatedAt: new Date().toISOString(),
  };

  executeInBatches(remoteAdd, repoPath, report);
  executeInBatches(fetches, repoPath, report);

  if (mergeBranch) {
    for (const remote of remotes) {
      const mergeCommand = `git merge --no-ff --no-commit ${remote}/${mergeBranch}`;
      if (dryRun) {
        report.dryRunCommands.push(mergeCommand);
        continue;
      }

      try {
        shell(mergeCommand, repoPath);
        shell('git merge --abort || true', repoPath);
        report.merges.push({ remote, status: 'clean' });
      } catch (error) {
        report.conflicts.push({
          remote,
          branch: mergeBranch,
          error: error instanceof Error ? error.message : String(error),
        });
        shell('git merge --abort || git reset --hard HEAD', repoPath);
      }
    }
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
