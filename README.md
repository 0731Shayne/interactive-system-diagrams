# Interactive System Diagrams

An interactive front-end for browsing system block diagrams and selecting functional modules. The current version includes six application diagrams:

- Home air conditioner
- Central air conditioner
- String inverter
- Industrial control / servo
- Energy storage PCS
- LV-BMS

Each diagram is rendered as a scalable SVG with accessible clickable regions. Selecting a region updates the module detail panel. Product data is intentionally left empty and can later be connected by the stable module IDs already included in the page.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm test
```

## Main files

- `app/page.tsx` — diagram definitions, clickable areas and interaction logic
- `app/globals.css` — responsive layout and interaction styles
- `public/diagrams/` — the six source SVG diagrams

Built with React, Next.js and vinext.

## 本地 SVG 与替换说明

网页读取的是项目本地文件，不要求把 SVG 单独放到 GitHub 或其他图床。六张图统一存放在：

```text
public/diagrams/
```

替换框图时，最简单的方法是使用相同文件名覆盖原文件：

```text
home-air-conditioner.svg
central-air-conditioner.svg
string-inverter.svg
industrial-control.svg
energy-storage-pcs.svg
lv-bms.svg
```

如果需要修改文件名，请同时修改 `app/page.tsx` 中对应方案的 `src`。如果新 SVG 的画布尺寸或方框位置发生变化，还需要同步修改该方案的 `viewBox` 和 `hotspots` 坐标，否则点击区域会与图形错位。

当前页面使用的 SVG 已移除左上角重复标题、右上角 Southchip 标志，以及原稿底部的 `Category / Description / Functions` 表格。再次替换原始 SVG 后，可以运行：

```bash
node scripts/clean-diagrams.mjs
```

该脚本会重新执行标题与标志遮罩以及表格裁切。

本地替换完成后运行：

```bash
npm run dev
```

浏览器打开终端显示的本地地址即可预览，无需上传 SVG。

## GitHub Pages 部署

项目包含 GitHub Pages 专用的静态构建，仍然保留方框点击、图纸切换、详情面板和缩放交互：

```bash
npm run build:pages
```

推送到 `main` 后，GitHub Actions 会自动构建并部署 `pages-dist`。
