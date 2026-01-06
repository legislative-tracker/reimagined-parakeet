# Contributing to Legislative Tracker

Thank you for your interest in contributing! This document outlines the standards and workflows for developing on the Legislative Tracker PWA.

## 🏗️ Monorepo Structure

This repository is a monorepo containing both the frontend and serverless backend:

- **`frontend/`**: Angular v20+ (Zoneless) application.
- **`backend/functions/`**: Firebase Cloud Functions (Node 24).

---

## 🛠️ Development Workflow

### Prerequisites

Ensure your environment matches our constraints:

- **Node.js**: v24.x (Required for backend functions)
- **npm**: v10+
- **Firebase CLI**: `npm install -g firebase-tools`
- **Java**: Required for running Firebase Emulators locally (Firestore/Auth).

### 1. Setup

Install dependencies for the root, frontend, and backend using the following commands:

```bash
# 1. Install root dependencies (orchestration scripts)
npm install

# 2. Install Frontend dependencies
cd frontend
npm install

# 3. Install Backend dependencies
cd ../backend/functions
npm install
```

### 2. Running Locally

We utilize convenience scripts in the root `package.json` to manage the stack. You do not need to `cd` into directories to run these.

**To run the Backend (Emulators):**
This starts Firestore, Auth, and Functions emulators.

```bash
npm run serve:backend
```

**To run the Frontend:**
Starts the Angular CLI dev server on port 4200.

```bash
npm run serve:frontend
```

**To Build All:**
Compiles both frontend and backend for production.

```bash
npm run build
```

---

## 📐 Architectural Standards

### Frontend (Angular v20)

- **Zoneless Change Detection**: We explicitly use `provideZonelessChangeDetection()`. Do not rely on `Zone.js` patching.
- **Signals**: Prefer Angular Signals over RxJS for synchronous state management.
- **Standalone Components**: We do not use NgModules. All components must be `standalone: true`.
- **Styles**: Use SCSS.

### Backend (Firebase)

- **Runtime**: Node.js v24. Ensure you are not using legacy Node APIs.
- **Type Safety**: Share interfaces between frontend and backend where possible to ensure type safety across the network boundary.

---

## 🧹 Code Style & Quality

We strictly enforce code style using **Prettier** and **ESLint**.

- **VS Code**: This project is configured with workspace settings.
  - **Format On Save**: Enabled. Please ensure your editor respects the `.prettierrc` configuration.
  - **Spell Checker**: We use the "Code Spell Checker" extension. Project-specific words are defined in `.vscode/settings.json`.
- **Linting**:
  - Backend: Run `npm run lint` inside `backend/functions/` to check for issues.
  - Frontend: Standard Angular linting applies.

---

## 📮 Submitting a Pull Request

1. Create a feature branch (`git checkout -b feature/my-feature`).
2. Ensure the code builds cleanly (`npm run build`).
3. Open a Pull Request against the `main` branch.
4. Ensure all CI checks pass.
