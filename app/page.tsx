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
    src: "/diagrams/home-air-conditioner.svg",
    viewBox: "0 0 1280 720",
    hotspots: [
      { id: "voice", label: "语音模块", category: "人机交互", description: "语音识别与控制接口，可关联语音处理和接口器件。", x: 43, y: 216, width: 100, height: 43 },
      { id: "wifi", label: "Wi-Fi 模块", category: "无线连接", description: "负责空调联网、远程控制和云端通信。", x: 43, y: 273, width: 100, height: 46 },
      { id: "sensor", label: "传感器模块", category: "环境感知", description: "温度、湿度及其他环境传感信号采集。", x: 43, y: 332, width: 100, height: 47 },
      { id: "level-shifter", label: "I²C 电平转换", category: "接口与转换", description: "在不同工作电压的器件之间完成双向电平转换。", x: 171, y: 218, width: 101, height: 158 },
      { id: "mcu", label: "MCU / Processor", category: "主控处理", description: "整机控制核心，协调传感、显示、通信和电机控制。", x: 300, y: 205, width: 204, height: 230 },
      { id: "display", label: "Display Board", category: "显示控制", description: "显示面板及其串行通信接口。", x: 348, y: 132, width: 105, height: 48 },
      { id: "power-stage", label: "功率模块", category: "功率驱动", description: "驱动 MOSFET 或 IGBT，为加热器和蜂鸣器等负载供电。", x: 515, y: 220, width: 115, height: 50 },
      { id: "isolator", label: "双通道隔离器", category: "数字隔离", description: "隔离 MCU 与电机驱动侧的 UART 控制信号。", x: 528, y: 291, width: 72, height: 101 },
      { id: "motor-driver", label: "BDC / BLDC 驱动", category: "电机驱动", description: "面向有刷与无刷直流电机的驱动方案。", x: 603, y: 288, width: 96, height: 108 },
      { id: "humidity", label: "湿度传感器", category: "环境感知", description: "采集室内湿度并向主控制器反馈。", x: 276, y: 446, width: 105, height: 42 },
      { id: "protection", label: "通信保护", category: "接口保护", description: "为 RS-485、CAN 等外部接口提供浪涌及静电保护。", x: 542, y: 444, width: 107, height: 44 },
      { id: "relay-driver", label: "继电器驱动", category: "负载驱动", description: "用于继电器和交流风机等外围负载控制。", x: 1063, y: 350, width: 107, height: 61 },
    ],
  },
  {
    id: "central-air-conditioner",
    name: "商用空调",
    shortName: "商用空调",
    subtitle: "多机通信、变频功率级与隔离采样",
    src: "/diagrams/central-air-conditioner.svg",
    viewBox: "0 0 1280 720",
    hotspots: [
      { id: "can-isolation", label: "CAN / 485 隔离", category: "隔离通信", description: "主机与多个室内机之间的隔离通信链路。", x: 230, y: 184, width: 100, height: 257 },
      { id: "homebus", label: "Homebus", category: "总线通信", description: "面向空调内外机通信的电力线载波接口。", x: 385, y: 205, width: 94, height: 220 },
      { id: "gate-driver", label: "高低侧栅极驱动", category: "功率驱动", description: "为压缩机和风机逆变功率级提供多通道栅极驱动。", x: 802, y: 191, width: 137, height: 91 },
      { id: "voltage-sensing", label: "隔离电压采样", category: "信号采集", description: "高压侧电压的安全隔离测量。", x: 948, y: 164, width: 137, height: 46 },
      { id: "current-sensing", label: "隔离电流采样", category: "信号采集", description: "三相电流的隔离采样与保护检测。", x: 1058, y: 230, width: 135, height: 48 },
      { id: "relay", label: "继电器阵列驱动", category: "负载驱动", description: "集中驱动多个继电器及辅助负载。", x: 819, y: 286, width: 111, height: 64 },
    ],
  },
  {
    id: "string-inverter",
    name: "组串逆变器",
    shortName: "组串逆变器",
    subtitle: "光伏输入、MPPT、隔离采样与逆变控制",
    src: "/diagrams/string-inverter.svg",
    viewBox: "0 0 1280 720",
    hotspots: [
      { id: "dcdc-buck", label: "DCDC Buck", category: "辅助电源", description: "将高压输入转换为控制与驱动所需的低压电源。", x: 321, y: 93, width: 136, height: 61 },
      { id: "dc-filter", label: "DC Filter", category: "输入滤波", description: "抑制输入侧噪声并改善直流母线质量。", x: 220, y: 212, width: 116, height: 78 },
      { id: "mppt", label: "DC Boost / MPPT", category: "功率转换", description: "执行升压与最大功率点跟踪。", x: 355, y: 211, width: 123, height: 83 },
      { id: "voltage-sensing", label: "隔离电压采样", category: "信号采集", description: "监测光伏输入和直流母线电压。", x: 326, y: 382, width: 112, height: 96 },
      { id: "current-sensing", label: "霍尔电流采样", category: "信号采集", description: "对输入与逆变侧电流进行隔离测量。", x: 326, y: 472, width: 112, height: 58 },
      { id: "dsp", label: "DSP", category: "数字控制", description: "负责 MPPT、逆变调制、保护和系统控制。", x: 458, y: 371, width: 148, height: 329 },
      { id: "iso-driver", label: "隔离栅极驱动", category: "功率驱动", description: "为 IGBT 或 MOSFET 提供隔离栅极驱动。", x: 616, y: 370, width: 136, height: 52 },
      { id: "output-sensing", label: "输出采样", category: "信号采集", description: "监测逆变输出的电流和电压。", x: 616, y: 416, width: 136, height: 81 },
      { id: "pwm-control", label: "PWM Controller + MOS", category: "电源控制", description: "生成辅助电源及功率级控制信号。", x: 606, y: 166, width: 179, height: 50 },
      { id: "can", label: "CAN 收发器", category: "有线通信", description: "提供控制器局域网连接。", x: 644, y: 614, width: 108, height: 48 },
      { id: "supervisor", label: "Supervisor", category: "系统监控", description: "监控电源和控制器运行状态。", x: 294, y: 562, width: 136, height: 65 },
    ],
  },
  {
    id: "industrial-control",
    name: "变频与伺服",
    shortName: "变频 / 伺服",
    subtitle: "数字与模拟 I/O、工业总线及功率驱动",
    src: "/diagrams/industrial-control.svg",
    viewBox: "0 0 1280 720",
    hotspots: [
      { id: "iso-driver", label: "六通道隔离驱动", category: "功率驱动", description: "为三相逆变桥提供六路隔离栅极驱动。", x: 814, y: 212, width: 153, height: 64 },
      { id: "current-amps", label: "隔离电流放大", category: "信号采集", description: "采集功率级电流并反馈到控制器。", x: 788, y: 299, width: 188, height: 43 },
      { id: "bus-isolator", label: "工业总线隔离", category: "隔离通信", description: "为 RS-485、CAN 等工业总线提供数字隔离。", x: 396, y: 439, width: 152, height: 87 },
      { id: "voltage-amps", label: "隔离电压放大", category: "信号采集", description: "用于母线和功率级的隔离电压测量。", x: 768, y: 448, width: 188, height: 43 },
      { id: "power-controller", label: "DCDC / PWM 控制器", category: "电源管理", description: "生成系统辅助电源和模拟电源轨。", x: 396, y: 564, width: 152, height: 47 },
      { id: "low-voltage-power", label: "LDO 与隔离 DCDC", category: "电源管理", description: "为 MCU 和隔离接口提供低压电源。", x: 215, y: 553, width: 103, height: 83 },
      { id: "driver-board-power", label: "驱动板辅助电源", category: "辅助电源", description: "为驱动板各隔离域提供多路辅助电源。", x: 667, y: 565, width: 233, height: 49 },
      { id: "flyback", label: "Flyback", category: "辅助电源", description: "从交流或直流输入生成隔离辅助电源。", x: 997, y: 564, width: 103, height: 47 },
    ],
  },
  {
    id: "energy-storage-pcs",
    name: "储能 PCS",
    shortName: "储能 PCS",
    subtitle: "电池、光伏、双向变换与系统通信",
    src: "/diagrams/energy-storage-pcs.svg",
    viewBox: "0 0 1280 720",
    hotspots: [
      { id: "bms", label: "BMS", category: "电池管理", description: "电池监测、保护和状态管理接口。", x: 80, y: 136, width: 170, height: 49 },
      { id: "iso-can-power", label: "隔离 CAN 与隔离电源", category: "隔离通信", description: "在 BMS 与控制系统之间提供通信和电源隔离。", x: 80, y: 199, width: 170, height: 60 },
      { id: "bidirectional-dcdc", label: "双向 DCDC", category: "功率转换", description: "实现电池充放电方向的双向能量传输。", x: 507, y: 135, width: 119, height: 100 },
      { id: "dcdc-driver", label: "DCDC 隔离驱动", category: "功率驱动", description: "驱动双向 DCDC 功率开关。", x: 667, y: 123, width: 111, height: 52 },
      { id: "pv-sensing", label: "光伏电流与电压采样", category: "信号采集", description: "采集光伏组串输入电流和电压。", x: 44, y: 351, width: 235, height: 137 },
      { id: "mppt-sensing", label: "MPPT 电流采样", category: "信号采集", description: "为 MPPT 控制回路提供电流反馈。", x: 284, y: 352, width: 111, height: 137 },
      { id: "mppt-driver", label: "MPPT 隔离驱动", category: "功率驱动", description: "驱动 MPPT 级功率器件。", x: 398, y: 352, width: 106, height: 137 },
      { id: "bus-sensing", label: "母线电流与电压采样", category: "信号采集", description: "采集直流母线电流与电压用于控制和保护。", x: 523, y: 352, width: 106, height: 137 },
      { id: "dsp", label: "DSP", category: "数字控制", description: "负责功率变换、采样闭环与保护控制。", x: 237, y: 487, width: 768, height: 54 },
      { id: "spi", label: "隔离 SPI 通信", category: "隔离通信", description: "连接 DSP 与 ARM 控制域的高速隔离通信。", x: 326, y: 578, width: 257, height: 52 },
      { id: "arm", label: "ARM", category: "系统管理", description: "负责上层通信、显示和系统管理。", x: 613, y: 540, width: 101, height: 126 },
      { id: "interfaces", label: "隔离通信接口", category: "外部通信", description: "提供 RS-485、CAN 等外部隔离通信接口。", x: 742, y: 536, width: 166, height: 87 },
    ],
  },
  {
    id: "lv-bms",
    name: "低压电池管理系统",
    shortName: "LV-BMS",
    subtitle: "多节电芯监测、隔离通信和低边驱动",
    src: "/diagrams/lv-bms.svg",
    viewBox: "0 0 1154.55 841.889",
    hotspots: [
      { id: "cells-high", label: "Cell 11–20", category: "电芯组", description: "上半组电芯的串联采样区域。", x: 124, y: 235, width: 126, height: 106 },
      { id: "afe-high", label: "AFE（上组）", category: "电池前端", description: "采集上半组电芯电压并执行均衡和诊断。", x: 288, y: 175, width: 102, height: 177 },
      { id: "cells-low", label: "Cell 1–10", category: "电芯组", description: "下半组电芯的串联采样区域。", x: 124, y: 405, width: 126, height: 111 },
      { id: "afe-low", label: "AFE（下组）", category: "电池前端", description: "采集下半组电芯电压并执行均衡和诊断。", x: 290, y: 345, width: 102, height: 179 },
      { id: "i2c-isolator", label: "I²C 隔离器", category: "数字隔离", description: "隔离上层 AFE 与主控制器之间的 I²C 通信。", x: 422, y: 260, width: 92, height: 41 },
      { id: "mcu", label: "MCU", category: "主控处理", description: "汇总电芯数据并执行保护、通信和驱动控制。", x: 540, y: 244, width: 110, height: 227 },
      { id: "buck", label: "高压 Buck", category: "电源管理", description: "从电池组高压侧生成低压系统电源。", x: 652, y: 194, width: 158, height: 54 },
      { id: "isolated-power", label: "隔离电源", category: "电源管理", description: "为隔离通信域提供独立电源。", x: 650, y: 303, width: 132, height: 55 },
      { id: "channel-isolator", label: "多通道隔离器", category: "数字隔离", description: "隔离 MCU 与外部通信控制域。", x: 650, y: 389, width: 132, height: 64 },
      { id: "mos-driver", label: "低边 MOS 驱动", category: "功率驱动", description: "驱动低边 MOSFET 完成负载或保护控制。", x: 665, y: 505, width: 154, height: 57 },
    ],
  },
];

export default function Home() {
  const [diagramId, setDiagramId] = useState(diagrams[0].id);
  const [selectedId, setSelectedId] = useState(diagrams[0].hotspots[4].id);
  const [zoom, setZoom] = useState(1);

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
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>系统方案中心</span>
        </div>
        <div className="header-note">
          <span className="status-dot" />
          交互框图演示
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">SYSTEM BLOCK DIAGRAMS</p>
          <h1>系统框图与器件选型</h1>
          <p className="hero-copy">选择应用场景，点击图中高亮功能块查看模块信息。产品数据可在后续直接接入。</p>
        </div>
        <div className="hero-stat" aria-label="当前收录六个系统方案">
          <strong>06</strong>
          <span>系统方案</span>
        </div>
      </section>

      <nav className="diagram-tabs" aria-label="选择系统框图">
        {diagrams.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={item.id === diagram.id ? "diagram-tab is-active" : "diagram-tab"}
            onClick={() => selectDiagram(item)}
            aria-current={item.id === diagram.id ? "page" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.shortName}
          </button>
        ))}
      </nav>

      <section className="workspace">
        <div className="diagram-column">
          <div className="diagram-heading">
            <div>
              <p className="eyebrow">APPLICATION OVERVIEW</p>
              <h2>{diagram.name}</h2>
              <p>{diagram.subtitle}</p>
            </div>
            <div className="zoom-controls" aria-label="缩放控制">
              <button type="button" onClick={() => setZoom((value) => Math.max(0.8, Number((value - 0.2).toFixed(1))))} aria-label="缩小">−</button>
              <button type="button" className="zoom-value" onClick={() => setZoom(1)} aria-label="恢复原始缩放">{Math.round(zoom * 100)}%</button>
              <button type="button" onClick={() => setZoom((value) => Math.min(2, Number((value + 0.2).toFixed(1))))} aria-label="放大">＋</button>
            </div>
          </div>

          <div className="diagram-viewport">
            <div className="diagram-stage" style={{ width: `${zoom * 100}%` }}>
              <svg className="system-diagram" viewBox={diagram.viewBox} role="img" aria-label={`${diagram.name}交互框图`}>
                <image href={diagram.src} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
                {diagram.hotspots.map((hotspot, index) => {
                  const active = hotspot.id === selected.id;
                  return (
                    <g
                      key={hotspot.id}
                      className={active ? "hotspot is-selected" : "hotspot"}
                      data-testid={`hotspot-${hotspot.id}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`查看${hotspot.label}`}
                      onClick={() => setSelectedId(hotspot.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedId(hotspot.id);
                        }
                      }}
                    >
                      <title>{hotspot.label}</title>
                      <rect className="hotspot-box" x={hotspot.x} y={hotspot.y} width={hotspot.width} height={hotspot.height} rx="7" />
                      <circle className="hotspot-index" cx={hotspot.x + hotspot.width - 3} cy={hotspot.y + 3} r="12" />
                      <text className="hotspot-number" x={hotspot.x + hotspot.width - 3} y={hotspot.y + 7} textAnchor="middle">{index + 1}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="diagram-legend">
            <span><i className="legend-box" />可点击模块</span>
            <span><i className="legend-selected" />当前选中</span>
            <span>可使用键盘 Tab + Enter 操作</span>
          </div>
        </div>

        <aside className="detail-panel" aria-live="polite">
          <div className="detail-kicker">
            <span>MODULE {String(diagram.hotspots.indexOf(selected) + 1).padStart(2, "0")}</span>
            <span className="detail-category">{selected.category}</span>
          </div>
          <h2>{selected.label}</h2>
          <p className="detail-description">{selected.description}</p>

          <div className="detail-tabs" role="tablist" aria-label="模块详情">
            <button type="button" className="is-active" role="tab" aria-selected="true">产品</button>
            <button type="button" role="tab" aria-selected="false">参考设计</button>
          </div>

          <div className="empty-products">
            <div className="empty-icon" aria-hidden="true"><span /><span /><span /></div>
            <h3>产品数据待接入</h3>
            <p>交互和数据接口已经预留。后续只需按模块 ID 关联公司及产品，即可在这里自动展示。</p>
          </div>

          <div className="data-preview">
            <div className="data-preview-head">
              <span>预留数据结构</span>
              <span className="ready-badge">READY</span>
            </div>
            <dl>
              <div><dt>系统</dt><dd>{diagram.name}</dd></div>
              <div><dt>模块 ID</dt><dd>{selected.id}</dd></div>
              <div><dt>产品数量</dt><dd>0</dd></div>
            </dl>
          </div>
        </aside>
      </section>

      <footer>
        <span>System Solution Explorer</span>
        <span>SVG interactive prototype · 2026</span>
      </footer>
    </main>
  );
}
