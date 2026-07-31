import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const diagramDirectory = join(process.cwd(), "public", "diagrams");

const cleanupRules = {
  "home-air-conditioner.svg": {
    height: 520,
    masks: [
      { x: 0, y: 24, width: 650, height: 92 },
      { x: 1050, y: 35, width: 230, height: 55 },
    ],
    overrides: [
      '<rect x="774" y="255" width="92" height="46" fill="#FFFFFF"/>',
      '<rect x="778" y="258" width="85" height="39" fill="#FF0000"/>',
      '<text x="820.5" y="273" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Microsoft YaHei, PingFang SC, sans-serif" font-size="9.5" font-weight="700">电流环通信</text>',
      '<text x="820.5" y="289" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Microsoft YaHei, PingFang SC, sans-serif" font-size="9.5" font-weight="700">方案</text>',
    ],
  },
  "central-air-conditioner.svg": {
    height: 500,
    masks: [
      { x: 0, y: 24, width: 620, height: 88 },
      { x: 1050, y: 35, width: 230, height: 55 },
    ],
  },
  "string-inverter.svg": {
    masks: [
      { x: 0, y: 24, width: 430, height: 78 },
      { x: 1050, y: 35, width: 230, height: 55 },
    ],
  },
  "industrial-control.svg": {
    masks: [
      { x: 0, y: 24, width: 500, height: 78 },
      { x: 1050, y: 35, width: 230, height: 55 },
    ],
  },
  "energy-storage-pcs.svg": {
    masks: [
      { x: 0, y: 24, width: 340, height: 82 },
      { x: 1050, y: 35, width: 230, height: 55 },
    ],
  },
  "lv-bms.svg": {
    masks: [],
    overrides: [
      '<rect x="947" y="289" width="131" height="55" fill="#FFFFFF"/>',
      '<rect x="948" y="291" width="128" height="50" fill="#FF0000" stroke="#000000" stroke-width="0.75"/>',
      '<text x="1012" y="305" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="9.5">3 in 1</text>',
      '<text x="1012" y="320" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="9" font-weight="700">CAN/485 Interface</text>',
      '<text x="1012" y="334" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="9" font-weight="700">w/ Isolated Power</text>',
    ],
  },
};

for (const [fileName, rule] of Object.entries(cleanupRules)) {
  const filePath = join(diagramDirectory, fileName);
  let source = await readFile(filePath, "utf8");

  source = source.replace(/<g id="diagram-cleanup"[\s\S]*?<\/g>/, "");

  if (rule.height) {
    source = source.replace(
      /<svg width="1280" height="\d+"(?: viewBox="[^"]+")?/,
      `<svg width="1280" height="${rule.height}" viewBox="0 0 1280 ${rule.height}"`,
    );
  }

  const cleanupLayer = [
    '<g id="diagram-cleanup" pointer-events="none">',
    ...(rule.masks ?? []).map(
      ({ x, y, width, height }) =>
        `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#FFFFFF"/>`,
    ),
    ...(rule.overrides ?? []),
    "</g>",
  ].join("");

  source = source.replace(/<\/svg>\s*$/, `${cleanupLayer}</svg>`);
  await writeFile(filePath, source, "utf8");
}

console.log("Diagram titles, legacy tables, and top-right Southchip logos removed.");
