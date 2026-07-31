"use client";

import { useMemo, useState } from "react";

type Hotspot = {
  id: string;
  label: string;
  category: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  areas?: Array<Pick<Hotspot, "x" | "y" | "width" | "height">>;
  borderPadding?: number;
};

type Diagram = {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  src: string;
  viewBox: string;
  hotspots: Hotspot[];
};

const diagrams: Diagram[] = [
  {
    id: "home-air-conditioner",
    name: "家用空调",
    shortName: "家用空调",
    subtitle: "室内机控制、传感、通信与电机驱动",
    src: "diagrams/home-air-conditioner.svg",
    viewBox: "0 0 1280 520",
    hotspots: [
      { id: "isolator", label: "双通道隔离器", category: "数字隔离", description: "隔离 MCU 与电机驱动侧的 UART 控制信号。", x: 534, y: 299, width: 59, height: 29, areas: [{ x: 534, y: 299, width: 59, height: 29 }, { x: 534, y: 357, width: 59, height: 28 }] },
      { id: "power-isolation", label: "电流环通信方案", category: "数字隔离", description: "隔离室内机控制域与室外机功率模块之间的状态和控制信号。", x: 778, y: 258, width: 85, height: 39, borderPadding: 2 },
      { id: "relay-driver", label: "继电器驱动", category: "负载驱动", description: "用于继电器和交流风机等外围负载控制。", x: 1071, y: 359, width: 91, height: 44 },
    ],
  },
  {
    id: "central-air-conditioner",
    name: "商用空调",
    shortName: "商用空调",
    subtitle: "多机通信、变频功率级与隔离采样",
    src: "diagrams/central-air-conditioner.svg",
    viewBox: "0 0 1280 500",
    hotspots: [
      { id: "can-isolation", label: "CAN / 485 隔离", category: "隔离通信", description: "主机与多个室内机之间的隔离通信链路。", x: 239, y: 194, width: 79, height: 46, areas: [{ x: 239, y: 194, width: 79, height: 46 }, { x: 239, y: 290, width: 79, height: 45 }, { x: 241, y: 386, width: 79, height: 45 }] },
      { id: "homebus", label: "Homebus", category: "总线通信", description: "面向空调内外机通信的电力线载波接口。", x: 395, y: 216, width: 73, height: 17, areas: [{ x: 395, y: 216, width: 73, height: 17 }, { x: 395, y: 267, width: 73, height: 17 }, { x: 395, y: 342, width: 73, height: 17 }, { x: 395, y: 399, width: 73, height: 17 }] },
      { id: "gate-driver", label: "高低侧栅极驱动", category: "功率驱动", description: "为压缩机和风机逆变功率级提供多通道栅极驱动。", x: 814, y: 203, width: 93, height: 51, areas: [{ x: 814, y: 203, width: 93, height: 51 }, { x: 822, y: 210, width: 93, height: 51 }, { x: 833, y: 219, width: 93, height: 51 }] },
      { id: "voltage-sensing", label: "隔离电压采样", category: "信号采集", description: "高压侧电压的安全隔离测量。", x: 958, y: 174, width: 115, height: 25 },
      { id: "current-sensing", label: "隔离电流采样", category: "信号采集", description: "三相电流的隔离采样与保护检测。", x: 1068, y: 240, width: 113, height: 26 },
      { id: "relay", label: "继电器阵列驱动", category: "负载驱动", description: "集中驱动多个继电器及辅助负载。", x: 829, y: 295, width: 90, height: 44 },
    ],
  },
  {
    id: "string-inverter",
    name: "组串逆变器",
    shortName: "组串逆变器",
    subtitle: "光伏输入、MPPT、隔离采样与逆变控制",
    src: "diagrams/string-inverter.svg",
    viewBox: "0 0 1280 720",
    hotspots: [
      { id: "dcdc-buck", label: "DCDC Buck", category: "辅助电源", description: "为控制、驱动与信号链生成低压电源。", x: 329, y: 101, width: 120, height: 45, areas: [{ x: 329, y: 101, width: 120, height: 45 }, { x: 746, y: 91, width: 114, height: 38 }] },
      { id: "ldo", label: "LDO", category: "线性稳压", description: "为 DSP 等低压控制器件提供稳定电源。", x: 920, y: 98, width: 98, height: 27 },
      { id: "iso-driver", label: "隔离栅极驱动", category: "功率驱动", description: "为输入升压级和逆变级提供隔离栅极驱动。", x: 333, y: 392, width: 99, height: 34, areas: [{ x: 333, y: 392, width: 99, height: 34 }, { x: 627, y: 380, width: 113, height: 31 }] },
      { id: "iso-amps", label: "隔离放大器", category: "隔离采样", description: "用于直流侧与交流侧电压、电流的隔离采样。", x: 338, y: 437, width: 90, height: 31, areas: [{ x: 338, y: 437, width: 90, height: 31 }, { x: 627, y: 463, width: 113, height: 23 }] },
      { id: "hall-sensor", label: "霍尔传感器", category: "电流采样", description: "对输入侧和输出侧电流进行隔离检测。", x: 333, y: 481, width: 91, height: 40, areas: [{ x: 333, y: 481, width: 91, height: 40 }, { x: 627, y: 425, width: 113, height: 31 }] },
      { id: "pwm-control", label: "PWM Controller + MOS", category: "电源控制", description: "生成辅助电源及功率级控制信号。", x: 616, y: 176, width: 159, height: 31 },
      { id: "can", label: "CAN 收发器", category: "有线通信", description: "提供控制器局域网连接。", x: 653, y: 623, width: 90, height: 30 },
      { id: "communication-isolation", label: "通信隔离", category: "数字隔离", description: "为 RS-485 与 CAN 等外部通信链路提供隔离。", x: 1020, y: 528, width: 107, height: 40, areas: [{ x: 1020, y: 528, width: 107, height: 40 }, { x: 908, y: 622, width: 79, height: 39 }] },
    ],
  },
  {
    id: "industrial-control",
    name: "变频与伺服",
    shortName: "变频 / 伺服",
    subtitle: "数字与模拟 I/O、工业总线及功率驱动",
    src: "diagrams/industrial-control.svg",
    viewBox: "0 0 1280 720",
    hotspots: [
      { id: "iso-driver", label: "六通道隔离驱动", category: "功率驱动", description: "为三相逆变桥提供六路隔离栅极驱动。", x: 823.5, y: 221.5, width: 134, height: 44 },
      { id: "current-amps", label: "隔离电流放大", category: "信号采集", description: "采集功率级电流并反馈到控制器。", x: 798.5, y: 310.5, width: 168, height: 21 },
      { id: "bus-isolator", label: "工业总线隔离", category: "隔离通信", description: "为 RS-485、CAN 等工业总线提供数字隔离。", x: 406.5, y: 450.5, width: 131, height: 26, areas: [{ x: 406.5, y: 450.5, width: 131, height: 26 }, { x: 406.5, y: 487.5, width: 131, height: 26 }] },
      { id: "voltage-amps", label: "隔离电压放大", category: "信号采集", description: "用于母线和功率级的隔离电压测量。", x: 778.5, y: 458.5, width: 168, height: 22 },
      { id: "power-controller", label: "DCDC / PWM 控制器", category: "电源管理", description: "生成系统辅助电源和模拟电源轨。", x: 406.5, y: 574.5, width: 131, height: 26 },
      { id: "low-voltage-power", label: "LDO 与隔离 DCDC", category: "电源管理", description: "为 MCU 和隔离接口提供低压电源。", x: 224.5, y: 564.5, width: 83, height: 16, areas: [{ x: 224.5, y: 564.5, width: 83, height: 16 }, { x: 224.5, y: 587.5, width: 83, height: 16 }, { x: 224.5, y: 609.5, width: 83, height: 16 }] },
      { id: "driver-board-power", label: "驱动板辅助电源", category: "辅助电源", description: "为驱动板各隔离域提供多路辅助电源。", x: 678.5, y: 578.5, width: 43, height: 25, areas: [{ x: 678.5, y: 578.5, width: 43, height: 25 }, { x: 843.5, y: 575.5, width: 46, height: 25 }] },
      { id: "flyback", label: "Flyback", category: "辅助电源", description: "从交流或直流输入生成隔离辅助电源。", x: 1008.5, y: 575.5, width: 81, height: 25 },
    ],
  },
  {
    id: "energy-storage-pcs",
    name: "储能 PCS",
    shortName: "储能 PCS",
    subtitle: "电池、光伏、双向变换与系统通信",
    src: "diagrams/energy-storage-pcs.svg",
    viewBox: "0 0 1280 720",
    hotspots: [
      { id: "bms", label: "BMS", category: "电池管理", description: "电池监测、保护和状态管理接口。", x: 89, y: 145, width: 152, height: 31 },
      { id: "iso-can-power", label: "隔离 CAN 与隔离电源", category: "隔离通信", description: "在 BMS 与控制系统之间提供通信和电源隔离。", x: 89, y: 209, width: 152, height: 41 },
      { id: "dcdc-driver", label: "DCDC 隔离驱动", category: "功率驱动", description: "驱动双向 DCDC 功率开关。", x: 678, y: 133, width: 86, height: 31 },
      { id: "high-voltage-hall-sensor", label: "高压侧霍尔传感器", category: "电流采样", description: "采集高压储能支路的电流信息。", x: 845, y: 133, width: 86, height: 33 },
      { id: "pv-hall-sensor", label: "光伏侧霍尔传感器", category: "电流采样", description: "采集光伏组串输入电流。", x: 54, y: 361, width: 86, height: 33 },
      { id: "mppt-hall-sensor", label: "MPPT 霍尔传感器", category: "电流采样", description: "为 MPPT 控制回路提供电流反馈。", x: 294, y: 362, width: 86, height: 33 },
      { id: "mppt-driver", label: "MPPT 隔离驱动", category: "功率驱动", description: "驱动 MPPT 级功率器件。", x: 408, y: 363, width: 86, height: 31 },
      { id: "bus-hall-sensor", label: "母线霍尔传感器", category: "电流采样", description: "采集直流母线电流用于控制和保护。", x: 533, y: 362, width: 86, height: 33 },
      { id: "inverter-driver", label: "逆变器隔离驱动", category: "功率驱动", description: "驱动逆变功率级。", x: 769, y: 362, width: 86, height: 31 },
      { id: "inverter-iso-power", label: "逆变器隔离电源", category: "隔离电源", description: "为逆变器隔离驱动域供电。", x: 868, y: 363, width: 86, height: 31 },
      { id: "ac-hall-sensor", label: "交流侧霍尔传感器", category: "电流采样", description: "采集交流输出侧电流。", x: 991, y: 363, width: 86, height: 33 },
      { id: "isolation-monitoring", label: "绝缘监测", category: "安全监测", description: "监测高压系统绝缘状态。", x: 37, y: 500, width: 142, height: 29 },
      { id: "spi", label: "隔离 SPI 通信", category: "隔离通信", description: "连接 DSP 与 ARM 控制域的高速隔离通信。", x: 335, y: 587, width: 238, height: 34 },
      { id: "interfaces", label: "隔离通信接口", category: "外部通信", description: "提供 RS-485、CAN 等外部隔离通信接口。", x: 752, y: 546, width: 145, height: 67, areas: [{ x: 752, y: 546, width: 145, height: 67 }, { x: 753, y: 621, width: 145, height: 32 }] },
      { id: "auxiliary-power", label: "辅助电源", category: "电源管理", description: "通过 Buck 与反激变换器生成系统辅助电源。", x: 1011, y: 531, width: 92, height: 30, areas: [{ x: 1011, y: 531, width: 92, height: 30 }, { x: 1011, y: 586, width: 185, height: 33 }] },
    ],
  },
  {
    id: "lv-bms",
    name: "低压电池管理系统",
    shortName: "LV-BMS",
    subtitle: "多节电芯监测、隔离通信和低边驱动",
    src: "diagrams/lv-bms.svg",
    viewBox: "0 0 1154.55 841.889",
    hotspots: [
      { id: "afe", label: "AFE", category: "电池前端", description: "采集两组电芯电压并执行均衡与诊断。", x: 288.106, y: 201.083, width: 81.47, height: 159.59, areas: [{ x: 288.106, y: 201.083, width: 81.47, height: 159.59 }, { x: 289.786, y: 370.918, width: 81.47, height: 159.42 }] },
      { id: "i2c-isolator", label: "I²C 隔离器", category: "数字隔离", description: "隔离 AFE 与主控制器之间的 I²C 通信。", x: 413.922, y: 259.883, width: 92.72, height: 28.22 },
      { id: "buck", label: "高压 Buck", category: "电源管理", description: "从电池组高压侧生成低压系统电源。", x: 631.959, y: 195.37, width: 177.72, height: 35.45 },
      { id: "ldo", label: "LDO", category: "线性稳压", description: "为低压控制和通信器件提供稳定电源。", x: 679.665, y: 262.065, width: 74.08, height: 23.35 },
      { id: "isolated-power", label: "隔离电源", category: "电源管理", description: "为隔离通信域提供独立电源。", x: 661.019, y: 308.93, width: 106.67, height: 36.96 },
      { id: "channel-isolator", label: "多通道隔离器", category: "数字隔离", description: "隔离 MCU 与外部通信控制域。", x: 674.458, y: 395.945, width: 90.54, height: 32.09 },
      { id: "can-interface", label: "CAN / 485 接口", category: "隔离通信", description: "提供电池管理系统对外通信接口。", x: 796.746, y: 395.945, width: 92.05, height: 32.09 },
      { id: "mos-driver", label: "低边 MOS 驱动", category: "功率驱动", description: "驱动低边 MOSFET 完成负载或保护控制。", x: 664.883, y: 508.835, width: 130.02, height: 27.55 },
      { id: "integrated-interface", label: "三合一隔离接口", category: "隔离通信", description: "集成 CAN / 485 接口与隔离电源。", x: 948, y: 291, width: 128, height: 50, borderPadding: 2 },
    ],
  },
];

export default function Home() {
  const [diagramId, setDiagramId] = useState(diagrams[0].id);
  const [selectedId, setSelectedId] = useState(diagrams[0].hotspots[0].id);
  const [zoom, setZoom] = useState(1);
  const [detailTab, setDetailTab] = useState<"products" | "references">("products");
  const [categoryOpen, setCategoryOpen] = useState(true);

  const diagram = useMemo(
    () => diagrams.find((item) => item.id === diagramId) ?? diagrams[0],
    [diagramId],
  );
  const selected =
    diagram.hotspots.find((hotspot) => hotspot.id === selectedId) ??
    diagram.hotspots[0];

  function selectDiagram(next: Diagram) {
    setDiagramId(next.id);
    setSelectedId(next.hotspots[0].id);
    setZoom(1);
    setDetailTab("products");
    setCategoryOpen(true);
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="site-brand">
          <span className="brand-symbol" aria-hidden="true" />
          <span>系统方案中心</span>
        </div>
        <span className="header-label">应用与设计资源</span>
      </header>

      <div className="page-content">
        <section className="page-heading">
          <p className="breadcrumb">应用 / 系统方案 / 交互式方框图</p>
          <div className="title-row">
            <div>
              <h1>{diagram.name}</h1>
              <p>{diagram.subtitle}</p>
            </div>
            <span className="diagram-count">6 个系统方案</span>
          </div>
        </section>

        <nav className="application-switcher" aria-label="选择系统框图">
          <span className="switcher-label">选择应用</span>
          <div className="switcher-buttons">
            {diagrams.map((item) => (
              <button
                type="button"
                key={item.id}
                className={item.id === diagram.id ? "application-button is-active" : "application-button"}
                onClick={() => selectDiagram(item)}
                aria-current={item.id === diagram.id ? "page" : undefined}
              >
                {item.shortName}
              </button>
            ))}
          </div>
        </nav>

        <section className="workspace">
          <div className="diagram-panel">
            <div className="diagram-instruction">
              <span className="instruction-mark" aria-hidden="true" />
              红色模块可点击并查看产品资源；灰色模块用于说明系统结构
            </div>

            <div className="diagram-viewport">
              <div className="diagram-stage" style={{ width: `${zoom * 100}%` }}>
                <svg className="system-diagram" viewBox={diagram.viewBox} role="img" aria-label={`${diagram.name}交互框图`}>
                  <image href={diagram.src} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
                  {diagram.hotspots.map((hotspot) => {
                    const active = hotspot.id === selected.id;
                    const borderPadding = hotspot.borderPadding ?? 3;
                    return (
                      <g
                        key={hotspot.id}
                        className={active ? "hotspot is-selected" : "hotspot"}
                        data-testid={`hotspot-${hotspot.id}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`查看${hotspot.label}`}
                        onClick={() => {
                          setSelectedId(hotspot.id);
                          setCategoryOpen(true);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedId(hotspot.id);
                            setCategoryOpen(true);
                          }
                        }}
                      >
                        <title>{hotspot.label}</title>
                        {(hotspot.areas ?? [hotspot]).map((area, index) => (
                          <g key={`${hotspot.id}-${index}`}>
                            <rect
                              className="hotspot-hitbox"
                              x={area.x - borderPadding}
                              y={area.y - borderPadding}
                              width={area.width + borderPadding * 2}
                              height={area.height + borderPadding * 2}
                            />
                            <rect
                              className="hotspot-outline-gap"
                              x={area.x - borderPadding}
                              y={area.y - borderPadding}
                              width={area.width + borderPadding * 2}
                              height={area.height + borderPadding * 2}
                              rx="1.5"
                            />
                            <rect
                              className="hotspot-box"
                              x={area.x - borderPadding}
                              y={area.y - borderPadding}
                              width={area.width + borderPadding * 2}
                              height={area.height + borderPadding * 2}
                              rx="1.5"
                            />
                          </g>
                        ))}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="diagram-controls" aria-label="缩放控制">
              <button type="button" onClick={() => setZoom((value) => Math.max(0.8, Number((value - 0.2).toFixed(1))))} aria-label="缩小">−</button>
              <button type="button" className="zoom-value" onClick={() => setZoom(1)} aria-label="恢复原始缩放">{Math.round(zoom * 100)}%</button>
              <button type="button" onClick={() => setZoom((value) => Math.min(2, Number((value + 0.2).toFixed(1))))} aria-label="放大">＋</button>
            </div>
          </div>

          <aside className="detail-panel" aria-live="polite">
            <div className="module-summary">
              <div className="summary-heading">
                <span className="module-label">已选择模块</span>
                <span className="detail-category">{selected.category}</span>
              </div>
              <h2>{selected.label}</h2>
              <p>{selected.description}</p>
              <button type="button" className="view-all-button">
                查看全部
                <span aria-hidden="true">⌄</span>
              </button>
            </div>

            <div className="detail-tabs" role="tablist" aria-label="模块详情">
              <button
                type="button"
                className={detailTab === "products" ? "is-active" : ""}
                role="tab"
                aria-selected={detailTab === "products"}
                onClick={() => setDetailTab("products")}
              >
                产品
              </button>
              <button
                type="button"
                className={detailTab === "references" ? "is-active" : ""}
                role="tab"
                aria-selected={detailTab === "references"}
                onClick={() => setDetailTab("references")}
              >
                参考设计
              </button>
            </div>

            {detailTab === "products" ? (
              <div className="resource-content">
                <button
                  type="button"
                  className="category-header"
                  onClick={() => setCategoryOpen((open) => !open)}
                  aria-expanded={categoryOpen}
                >
                  <span>{selected.category}（0）</span>
                  <span className={categoryOpen ? "chevron is-open" : "chevron"} aria-hidden="true">⌃</span>
                </button>

                {categoryOpen && (
                  <div className="product-placeholder">
                    <div className="placeholder-row">
                      <span className="placeholder-icon" aria-hidden="true">□</span>
                      <div>
                        <h3>产品数据待接入</h3>
                        <p>这里将按公司分组展示产品型号、主要参数和产品说明。</p>
                      </div>
                    </div>
                    <div className="field-preview">
                      <span>公司</span>
                      <span>产品型号</span>
                      <span>数据表 PDF / HTML</span>
                    </div>
                  </div>
                )}

                <button type="button" className="find-more-button">
                  <span className="filter-icon" aria-hidden="true">≡</span>
                  查找其他{selected.category}产品
                </button>
              </div>
            ) : (
              <div className="reference-placeholder">
                <span className="reference-symbol" aria-hidden="true">◇</span>
                <h3>参考设计待接入</h3>
                <p>后续可在这里展示参考设计、应用笔记和设计文件。</p>
              </div>
            )}

            <div className="module-meta">
              <span>{diagram.name}</span>
              <code>{selected.id}</code>
            </div>
          </aside>
        </section>

        <footer>
          <span>交互式系统方框图</span>
          <span>本地 SVG 资源 · 产品数据接口已预留</span>
        </footer>
      </div>
    </main>
  );
}
