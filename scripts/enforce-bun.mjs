const userAgent = process.env.npm_config_user_agent ?? "";
const execPath = process.env.npm_execpath ?? "";

const usingBun = userAgent.includes("bun/") || /(^|[/\\])bun(\.exe)?$/.test(execPath);

if (!usingBun) {
  console.error("This repository uses Bun only.");
  console.error("Use `bun install` to install dependencies.");
  console.error("Use `bun run <script>` to run project scripts.");
  process.exit(1);
}
