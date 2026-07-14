import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the personality spectrum landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /<title>人格光谱｜16 型人格倾向测试<\/title>/i);
  assert.match(html, /48 个日常选择/);
  assert.match(html, /不只给你四个字母/);
  assert.match(html, /不是 MBTI® 官方题库/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("ships the complete original questionnaire and type reports", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const questionBlock = page.match(/const questions: Question\[\] = \[([\s\S]*?)\n\];/)?.[1] ?? "";
  const profileBlock = page.match(/const profiles: Record<string, TypeProfile> = \{([\s\S]*?)\n\};/)?.[1] ?? "";

  assert.equal((questionBlock.match(/\{ id: \d+,/g) ?? []).length, 48);
  assert.equal((profileBlock.match(/^  [A-Z]{4}: \{/gm) ?? []).length, 16);
  assert.match(page, /role="progressbar"/);
  assert.match(page, /localStorage\.setItem\("spectrum-test-progress"/);
  assert.match(page, /dimensionNarratives/);
});
