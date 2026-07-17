import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import process from "node:process";

const navigationSource = await readFile(new URL("../src/lib/navigation.ts", import.meta.url), "utf8");
const routes = [...navigationSource.matchAll(/href:\s*"([^"]+)"/g)].map((match) => match[1]);
routes.push("/sign-in");

const uniqueRoutes = [...new Set(routes)];
const port = Number(process.env.SMOKE_PORT ?? 3300 + (process.pid % 500));
const origin = `http://127.0.0.1:${port}`;
const nextBinary = process.platform === "win32" ? "node_modules/.bin/next.cmd" : "node_modules/.bin/next";
let output = "";

const server = spawn(nextBinary, ["start"], {
  cwd: new URL("..", import.meta.url),
  env: {
    ...process.env,
    PORT: String(port),
    NEXT_TELEMETRY_DISABLED: "1"
  },
  stdio: ["ignore", "pipe", "pipe"]
});

server.stdout.on("data", (chunk) => { output += chunk.toString(); });
server.stderr.on("data", (chunk) => { output += chunk.toString(); });

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Production server exited before becoming ready.\n${output}`);
    try {
      const response = await fetch(`${origin}/api/health`, { cache: "no-store" });
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await delay(100);
  }
  throw new Error(`Timed out waiting for ${origin}.\n${output}`);
}

async function stopServer() {
  if (server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    delay(2_000)
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

try {
  await waitForServer();
  const failures = [];

  for (const route of uniqueRoutes) {
    const response = await fetch(`${origin}${route}`, { redirect: "follow" });
    const body = await response.text();
    if (!response.ok || !body.includes("EstateFlow")) {
      failures.push(`${route}: HTTP ${response.status}, EstateFlow marker ${body.includes("EstateFlow") ? "present" : "missing"}`);
    }
  }

  const health = await fetch(`${origin}/api/health`, { cache: "no-store" });
  const healthPayload = await health.json();
  if (!health.ok || healthPayload.status !== "ok") failures.push("/api/health: invalid response");

  const headerResponse = await fetch(`${origin}/dashboard`);
  const requiredHeaders = [
    "strict-transport-security",
    "x-frame-options",
    "x-content-type-options",
    "referrer-policy",
    "permissions-policy",
    "cross-origin-opener-policy"
  ];
  for (const header of requiredHeaders) {
    if (!headerResponse.headers.get(header)) failures.push(`/dashboard: missing ${header}`);
  }

  if (failures.length) throw new Error(`Smoke test failures:\n- ${failures.join("\n- ")}`);
  console.log(`Production smoke test passed (${uniqueRoutes.length} routes, health endpoint, and ${requiredHeaders.length} security headers).`);
} finally {
  await stopServer();
}
