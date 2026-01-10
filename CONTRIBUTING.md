# Contributing to Legislative Tracker

Thank you for your interest in contributing! This document outlines the standards and workflows for
development on the Legislative Tracker PWA.

## 🏗️ Monorepo Structure

This repository is a monorepo containing both the frontend and serverless backend:

- **`frontend/`**: Angular v20+ (Zoneless) application.
- **`backend/functions/`**: Firebase Cloud Functions (Node 24).

## 🛠️ Development Workflow

### Prerequisites

Ensure your environment matches our constraints:

- **Node.js**: v24.x (Required for backend functions)
- **npm**: v10+
- **Firebase CLI**: `npm install -g firebase-tools`
- **Java**: Required for running Firebase Emulators locally (Cloud Functions/Firestore/Auth).

### Setup

See the README for [Installation](./README.md#installation) &
[Configuration](./README.md#configuration) instructions.

## 📐 Architectural Standards

### Frontend (Angular v20)

- **Zoneless Change Detection**: We explicitly use `provideZonelessChangeDetection()`. Do not rely
  on `Zone.js` patching.
- **Signals**: Prefer Angular Signals over RxJS for synchronous state management.
- **Standalone Components**: We do not use NgModules. All components must be `standalone: true`.
- **Styles**: Use SCSS.

### Backend (Firebase)

- **Runtime**: Node.js v24. Ensure you are not using legacy Node APIs.
- **Type Safety**: Share interfaces between frontend and backend where possible to ensure type
  safety across the network boundary.

## 🧹 Code Style & Quality

We strictly enforce code style using **Prettier** and **ESLint**.

- **VS Code**: This project is configured with workspace settings.
  - **Format On Save**: Enabled. Please ensure your editor respects the `.prettierrc` configuration.
  - **Spell Checker**: We use the "Code Spell Checker" extension. Project-specific words are defined
    in `.vscode/settings.json`.
- **Linting**:
  - Backend: Run `npm run lint` inside `backend/functions/` to check for issues.
  - Frontend: Standard Angular linting applies.

## 📮 Submitting a Pull Request

1. Create a feature branch (`git checkout -b feature/my-feature`).
1. Ensure the code builds cleanly (`npm run build`).  
   **NOTE**: Running the build script in the root directory will automatically execute backend
   linting and frontend tests.
1. Open a Pull Request against the `main` branch and fill out
   [the PR template](.github/PULL_REQUEST_TEMPLATE.md)
1. Ensure all CI checks pass.
