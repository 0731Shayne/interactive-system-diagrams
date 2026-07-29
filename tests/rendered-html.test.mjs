import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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

test("server-renders the interactive diagram application", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /系统方案中心/);
  assert.match(html, /系统框图与器件选型/);
  assert.match(html, /家用空调/);
  assert.doesNotMatch(html, /codex-preview/);
  assert.doesNotMatch(html, /Your site is taking shape/);
});

test("ships all six source diagrams", async () => {
  const diagrams = [
    "home-air-conditioner.svg",
    "central-air-conditioner.svg",
    "string-inverter.svg",
    "industrial-control.svg",
    "energy-storage-pcs.svg",
    "lv-bms.svg",
  ];

  await Promise.all(
    diagrams.map((name) => access(new URL(`../public/diagrams/${name}`, import.meta.url))),
  );

  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /data-testid={`hotspot-/);
  assert.match(page, /产品数据待接入/);
});
