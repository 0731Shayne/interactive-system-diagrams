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
  assert.match(html, /交互式方框图/);
  assert.match(html, /家用空调/);
  assert.doesNotMatch(html, /codex-preview/);
  assert.doesNotMatch(html, /Your site is taking shape/);
});

test("ships existing and newly grouped source diagrams", async () => {
  const diagrams = [
    "home-air-conditioner.svg",
    "central-air-conditioner.svg",
    "string-inverter.svg",
    "industrial-control.svg",
    "energy-storage-pcs.svg",
    "lv-bms.svg",
    "embodied-robot-power-rail.svg",
    "embodied-robot-system.svg",
    "pv-inverter-solution.svg",
    "energy-storage-inverter-solution.svg",
    "portable-energy-storage-dcdc.svg",
    "industrial-inverter-solution.svg",
    "power-bank-charger-bms.svg",
    "server-single-phase-main.svg",
    "server-single-phase-aux.svg",
    "server-three-phase-main.svg",
    "server-three-phase-aux.svg",
    "server-hvdc-sic-main.svg",
    "server-hvdc-sic-aux.svg",
    "server-hv-ibc-gan-main.svg",
    "server-hv-ibc-gan-aux.svg",
    "server-lv-ibc-llc.svg",
    "server-lv-ibc-hsc.svg",
    "server-lv-ibc-multiphase-buck.svg",
  ];

  await Promise.all(
    diagrams.map((name) => access(new URL(`../public/diagrams/${name}`, import.meta.url))),
  );

  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /data-testid={`hotspot-/);
  assert.match(page, /产品数据待接入/);
  assert.match(page, /SC371P042F/);
  assert.match(page, /SC3771/);
  assert.match(page, /SC81460/);
  assert.match(page, /具身机器人/);
  assert.match(page, /服务器电源/);
  assert.match(page, /系统总览/);
  assert.match(page, /辅助电源/);
  assert.match(page, /多相 Buck/);
  assert.match(page, /selectView/);
});
