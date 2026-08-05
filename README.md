# Interactive System Diagrams

An interactive front-end for browsing system block diagrams and selecting functional modules. The current version includes 17 system pages and 24 local SVG diagrams.

- Home air conditioner
- Central air conditioner
- String inverter
- Industrial control / servo
- Energy storage PCS
- LV-BMS
- Embodied robot — system overview + power rail
- PV inverter, energy storage inverter, portable energy storage, industrial inverter and power-bank BMS
- Server single-phase PSU — main circuit + auxiliary power
- Server three-phase PSU — main circuit + auxiliary power
- Server HVDC SiC PSU — main circuit + auxiliary power
- Server high-voltage IBC GaN — main circuit + auxiliary power
- Server low-voltage IBC — LLC + HSC + multiphase Buck

Each diagram is rendered as a scalable SVG. Existing mapped diagrams retain accessible clickable regions; newly imported multi-drawing systems use view tabs so their overview, auxiliary supply and topology drawings stay together on one page.

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
- `public/diagrams/` — all local source SVG diagrams

Built with React, Next.js and vinext.

## 本地 SVG 与替换说明

网页读取的是项目本地文件，不要求把 SVG 单独放到其他图床。所有图统一存放在：

```text
public/diagrams/
```

替换框图时，最简单的方法是使用 `app/page.tsx` 中登记的相同文件名覆盖原文件。例如：

```text
home-air-conditioner.svg
central-air-conditioner.svg
string-inverter.svg
industrial-control.svg
energy-storage-pcs.svg
lv-bms.svg
embodied-robot-system.svg
embodied-robot-power-rail.svg
server-single-phase-main.svg
server-single-phase-aux.svg
```

如果需要修改文件名，请同时修改 `app/page.tsx` 中对应方案的 `src`。如果新 SVG 的画布尺寸或方框位置发生变化，还需要同步修改该方案的 `viewBox` 和 `hotspots` 坐标，否则点击区域会与图形错位。

最初六张图已移除左上角重复标题、右上角 Southchip 标志，以及原稿底部的 `Category / Description / Functions` 表格。新导入的机器人和服务器图纸保留压缩包中的原始构图与内容。再次替换最初六张原始 SVG 后，可以运行：

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
