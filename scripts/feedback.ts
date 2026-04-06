type TaskName = "typecheck" | "build" | "lint" | "test";

export {};

interface Task {
  args: string[];
  excerptLines: number;
  name: TaskName;
}

interface TaskResult {
  command: string;
  durationMs: number;
  exitCode: number;
  name: TaskName;
  output: string;
}

const bunBin = process.execPath;

const tasks: Task[] = [
  {
    name: "typecheck",
    args: ["x", "astro", "check", "--minimumSeverity=error"],
    excerptLines: 80,
  },
  {
    name: "build",
    args: ["x", "astro", "build"],
    excerptLines: 80,
  },
  {
    name: "lint",
    args: ["x", "biome", "lint", ".", "--error-on-warnings", "--files-ignore-unknown=true"],
    excerptLines: 100,
  },
  {
    // Dot reporter keeps the happy path quiet while still printing failed assertions clearly.
    name: "test",
    args: ["x", "vitest", "run", "--reporter=dot", "--silent=passed-only"],
    excerptLines: 120,
  },
];

function formatDuration(durationMs: number) {
  if (durationMs < 1000) {
    return `${Math.round(durationMs)}ms`;
  }

  if (durationMs < 10_000) {
    return `${(durationMs / 1000).toFixed(2)}s`;
  }

  return `${(durationMs / 1000).toFixed(1)}s`;
}

function compactOutput(stdout: string, stderr: string) {
  const combined = [stdout, stderr].filter(Boolean).join("\n");

  return combined.replace(/\r\n/g, "\n").trim();
}

function excerptOutput(output: string, maxLines: number) {
  const lines = output
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, index, allLines) => line !== "" || allLines[index - 1] !== "");

  if (lines.length <= maxLines) {
    return lines.join("\n").trim();
  }

  const headCount = Math.max(10, Math.floor(maxLines * 0.35));
  const tailCount = Math.max(20, maxLines - headCount - 1);
  const hiddenCount = lines.length - headCount - tailCount;

  return [
    ...lines.slice(0, headCount),
    `... (${hiddenCount} lines omitted) ...`,
    ...lines.slice(-tailCount),
  ].join("\n");
}

async function readStream(stream: ReadableStream<Uint8Array> | null) {
  if (!stream) {
    return "";
  }

  return await new Response(stream).text();
}

async function runTask(task: Task): Promise<TaskResult> {
  const startedAt = performance.now();
  const subprocess = Bun.spawn({
    cmd: [bunBin, ...task.args],
    cwd: process.cwd(),
    env: {
      ...process.env,
      FORCE_COLOR: "0",
      NO_COLOR: "1",
    },
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    readStream(subprocess.stdout),
    readStream(subprocess.stderr),
    subprocess.exited,
  ]);

  return {
    name: task.name,
    command: [bunBin, ...task.args].join(" "),
    durationMs: performance.now() - startedAt,
    exitCode,
    output: excerptOutput(compactOutput(stdout, stderr), task.excerptLines),
  };
}

const startedAt = performance.now();
const results = await Promise.all(tasks.map(runTask));
const totalDurationMs = performance.now() - startedAt;
const failedResults = results.filter((result) => result.exitCode !== 0);

if (failedResults.length === 0) {
  const timingSummary = results.map((result) => `${result.name} ${formatDuration(result.durationMs)}`);
  console.log(`feedback ok: ${timingSummary.join(" | ")} | total ${formatDuration(totalDurationMs)}`);
  process.exit(0);
}

const statusSummary = results.map((result) => {
  const status = result.exitCode === 0 ? "ok" : "failed";
  return `${result.name} ${status} ${formatDuration(result.durationMs)}`;
});

console.error(`feedback failed: ${statusSummary.join(" | ")} | total ${formatDuration(totalDurationMs)}`);

for (const result of failedResults) {
  console.error(`\n[${result.name}] ${result.command}`);

  if (result.output) {
    console.error(result.output);
    continue;
  }

  console.error("Command failed without diagnostic output.");
}

process.exit(1);
