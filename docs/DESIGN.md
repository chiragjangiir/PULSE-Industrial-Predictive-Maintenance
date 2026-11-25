# PULSE Design System Specification
## High-Performance Industrial HMI & Reliability Workbench

### 1. Philosophy & Architectural Goals
PULSE is an industrial reliability engineering and predictive maintenance decision platform.
Its UI is built on the core principles of **High-Performance HMI (ISA-101 / EEMUA 191 / ASM Consortium)**:
- **Situational Awareness over Decoration:** Abnormal conditions must command immediate attention; normal operations should be low-contrast and unobtrusive.
- **Disciplined Semantic Color:** Color is an information channel reserved exclusively for system states, operational alarms, and severity levels. No decorative rainbow palettes.
- **Workflow-Driven Information Architecture:** Interfaces are structured around operational decisions: *Detect &rarr; Diagnose &rarr; Quantify Urgency &rarr; Execute Maintenance Action*.
- **Data Density & Engineering Precision:** Tabular numerals, explicit physical units ($\text{K}, \text{RPM}, \text{Nm}, \text{min}, \text{W}$), and defined normal operating envelopes ($UCL / LCL$).

---

### 2. Color Palette & Token Hierarchy

#### Background & Surfaces
- Canvas: `#0B0E14` (Deep control-room slate, minimal eye fatigue)
- Surface / Workspace: `#111622` (Subdued panel background)
- Card / Data Cell: `#161D2B` (High-contrast surface for data cards and tables)
- Card Active / Hover: `#1C2537`
- Border Subtle: `#212C40` (Thin, crisp 1px division)
- Border Strong: `#2E3D58` (Active selection or section separator)

#### Typography
- Primary Text: `#F1F5F9` (Slate-100, maximum legibility)
- Secondary Text: `#94A3B8` (Slate-400, metadata, labels)
- Muted / Disabled: `#64748B` (Slate-500, units, baseline references)
- Numerals: `font-mono tabular-nums` for all sensor and statistical measurements.

#### Semantic State Tokens (Reserved Exclusively for Health & Alarms)
- **Critical Failure Imminent (Alarm Level 1):** `#EF4444` (Red-500)
- **High Risk / Degradation (Alarm Level 2):** `#F59E0B` (Amber-500)
- **Nominal / Healthy (Normal Condition):** `#10B981` (Emerald-500, used sparingly)
- **Telemetry / Primary Data Series:** `#38BDF8` (Sky-400 / Industrial Ice Blue)
- **Envelope Reference / Baseline:** `#475569` (Slate-600, dashed boundary)

---

### 3. Component Design Rules
1. **No 4-Identical-Card Stacks:** Screen headers feature a compact **Operational Health Posture Bar** displaying the distribution of healthy, flagged, and critical assets.
2. **Prioritized Equipment Lists:** Equipment needing immediate triage is ranked and highlighted at the top of lists and tables.
3. **Operational Limit Envelopes:** All sensor trend charts and scatter plots must display upper/lower control limits ($UCL / LCL$) or safe operating zones.
4. **Maintenance Action Integration:** Every diagnostic prediction must be accompanied by the physical root-cause explanation and prescribed maintenance action.

