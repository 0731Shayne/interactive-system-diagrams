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
