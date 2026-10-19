# Order Management System

A **frontend-only logistics operations prototype** demonstrating multi-step order, document, and verification workflows. Built with React, TypeScript, Tailwind CSS, and Vite.

> **Project scope:** This repository is a UI prototype. It uses local component state and demonstration data; it does **not** provide a backend, persistent database, real KYC verification, real payments, or production AI services.

## Features

- **Order discovery:** Search-oriented operations screens and order queues.
- **KYC workflow:** Vehicle and driver document upload screens, review outcomes, and verification status displays.
- **Advance and settlement:** Upload and review screens for advance documentation and final settlement.
- **Verification queue:** Separate review-oriented screens for operations and verification teams.
- **Exception and analytics views:** Prototype dashboards and process intelligence visualizations.
- **Navigation:** View switching managed in React component state rather than URL-based routing.

The UI interactions are intended to demonstrate workflows, not to execute real-world transactions.

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | React 18, TypeScript / TSX |
| Styling | Tailwind CSS 4, CSS |
| Tooling | Vite 6 |
| Components | Radix UI / shadcn-style primitives, Lucide icons |
| Data | Local state and demonstration data |

## Run locally

**Prerequisite:** Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local address printed by Vite (usually `http://localhost:5173`).

For a production bundle:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  app/
    App.tsx               # Top-level workflow state and view selection
    components/           # Order, KYC, settlement, review, analytics screens
      ui/                 # Reusable UI primitives
  styles/                 # Shared styles and theme
```

## Known limitations

- Demonstration data and workflow outcomes are simulated; no persistence between sessions is promised.
- No authentication, authorization, server APIs, or secure file storage.
- Some screens are exploratory prototypes and may not implement every production validation rule.
- Dashboard is a non-interactive sidebar placeholder in the current version.
- UI has not been verified for production accessibility or comprehensive automated test coverage.

## Design origin and attribution

This frontend was developed with assistance from **Figma Make**. [Original Figma design](https://www.figma.com/design/jfc8bYG2aptsVpEWlhCnzT/Order-Management-System-Screen--Copy-).

See [component and image attributions](src/app/Attributions.md). Third-party licenses and notices must be respected.

## Future improvements

- Add URL-based routing and automated UI tests.
- Add form validation and more complete accessibility checks.
- Connect to an authenticated backend and persistent storage if this evolves beyond a prototype.

## Screenshots

Screenshots can be added after running the app and verifying each screen locally. No screenshots are included in this repository version.
