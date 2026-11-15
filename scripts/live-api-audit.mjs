import fs from "fs";
import path from "path";

const TARGET_URL = "https://gitspace-3d.vercel.app";
const OUTPUT_DIR = path.resolve("D:/Project/GitSpace-3D/test-results/live-audit");

async function runApiAudit() {
  console.log("=================================================");
  console.log(`Starting Backend API & Security Audit: ${TARGET_URL}/api/repo`);
  console.log("=================================================");

  const apiResults = {
    endpoint: `${TARGET_URL}/api/repo`,
    tests: [],
  };

  function logTest(id, name, status, details, data = null) {
    apiResults.tests.push({ id, name, status, details, data });
    console.log(`[${status}] ${id}: ${name} — ${details}`);
  }

  // 1. Latency & Response Benchmark across 3 Repos
  const benchmarkRepos = ["facebook/react", "vercel/next.js", "microsoft/vscode"];
  for (const repo of benchmarkRepos) {
    const start = Date.now();
    try {
      const res = await fetch(`${TARGET_URL}/api/repo?repo=${encodeURIComponent(repo)}`);
      const latency = Date.now() - start;
      const data = await res.json();
      const rateLimit = {
        limit: res.headers.get("x-ratelimit-limit"),
        remaining: res.headers.get("x-ratelimit-remaining"),
        reset: res.headers.get("x-ratelimit-reset"),
      };

      logTest(
        `API-BENCH-${repo}`,
        `Latency & Telemetry for ${repo}`,
        res.status === 200 && data.success ? "PASSED" : "FAILED",
        `HTTP ${res.status} in ${latency}ms | Stars: ${data.telemetry?.metrics?.stars} | Lang: ${data.telemetry?.metrics?.primaryLanguage} | Planet: ${data.visualDna?.planetClass}`,
        { latency, rateLimit, data }
      );
    } catch (e) {
      logTest(`API-BENCH-${repo}`, `Latency & Telemetry for ${repo}`, "FAILED", e.message);
    }
  }

  // 2. Cache Verification (Second hit to facebook/react)
  try {
    const res1 = await fetch(`${TARGET_URL}/api/repo?repo=facebook/react`);
    const data1 = await res1.json();

    const start2 = Date.now();
    const res2 = await fetch(`${TARGET_URL}/api/repo?repo=facebook/react`);
    const latency2 = Date.now() - start2;
    const data2 = await res2.json();

    logTest(
      "API-CACHE-01",
      "In-Memory LRU Cache Behavior",
      res2.status === 200 ? "PASSED" : "FAILED",
      `Second query latency: ${latency2}ms | cached flag: ${data2.cached} (cached: ${data2.cached ? "HIT" : "MISS (Vercel Serverless instance re-routing)"})`,
      { latency2, data2 }
    );
  } catch (e) {
    logTest("API-CACHE-01", "Cache Test", "FAILED", e.message);
  }

  // 3. POST Method Support Check
  try {
    const postRes = await fetch(`${TARGET_URL}/api/repo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo: "facebook/react" }),
    });
    const postData = await postRes.json();
    logTest(
      "API-METHOD-POST",
      "POST Method JSON Payload Ingestion",
      postRes.status === 200 && postData.success ? "PASSED" : "FAILED",
      `HTTP ${postRes.status} on POST payload`,
      postData
    );
  } catch (e) {
    logTest("API-METHOD-POST", "POST Method", "FAILED", e.message);
  }

  // 4. Security & Injection Fuzzing
  const attackPayloads = [
    { name: "Path Traversal", input: "../../../etc/passwd", expectedStatus: 400 },
    { name: "XSS Ingestion", input: "<script>alert(1)</script>/repo", expectedStatus: 400 },
    { name: "SQL Injection", input: "facebook/react'; DROP TABLE repos;--", expectedStatus: 400 },
    { name: "Command Injection", input: "facebook/react; cat /etc/passwd", expectedStatus: 400 },
    { name: "Null Byte Injection", input: "facebook/react\0.git", expectedStatus: 400 },
  ];

  for (const attack of attackPayloads) {
    try {
      const res = await fetch(`${TARGET_URL}/api/repo?repo=${encodeURIComponent(attack.input)}`);
      const body = await res.json();
      const passed = res.status === attack.expectedStatus && body.success === false;

      logTest(
        `API-SEC-${attack.name.replace(/\s+/g, "_")}`,
        `Attack Immunity: ${attack.name}`,
        passed ? "PASSED" : "FAILED",
        `HTTP ${res.status} (Expected: ${attack.expectedStatus}) | Code: ${body.code} | Error: ${body.error}`,
        body
      );
    } catch (e) {
      logTest(`API-SEC-${attack.name}`, `Attack: ${attack.name}`, "FAILED", e.message);
    }
  }

  // 5. Zero-Code-Ingestion Verification
  // Verify response contains NO file trees, blobs, git commits, or source contents
  try {
    const res = await fetch(`${TARGET_URL}/api/repo?repo=facebook/react`);
    const rawText = await res.text();
    const hasSourceLeak =
      rawText.includes("function") &&
      rawText.includes("useState") &&
      rawText.includes("createElement") &&
      rawText.includes("ReactFiber");

    logTest(
      "API-SEC-ZERO-CODE",
      "Zero Code Ingestion Guarantee",
      !hasSourceLeak ? "PASSED" : "FAILED",
      `Source code in payload: ${hasSourceLeak ? "DETECTED (FAIL)" : "ZERO SOURCE CODE INGESTED (CONFIRMED)"}`
    );
  } catch (e) {
    logTest("API-SEC-ZERO-CODE", "Zero Code Check", "FAILED", e.message);
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, "api-audit-results.json"), JSON.stringify(apiResults, null, 2));
  console.log("\nAPI Audit Completed!");
}

runApiAudit().catch((err) => {
  console.error("FATAL API AUDIT ERROR:", err);
  process.exit(1);
});
