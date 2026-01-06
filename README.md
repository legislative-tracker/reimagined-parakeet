# Legislative Tracker PWA

**A modern Progressive Web Application for tracking legislative activity, built on Angular v20 and Firebase.**

The Legislative Tracker provides citizens and administrators with real-time insights into state-level legislation (currently focused on NY), allowing users to track bills, view member details, and manage legislative data.

---

## 🚀 Tech Stack & Architecture

This project leverages the bleeding edge of the 2025 web ecosystem:

### **Frontend**

- **Framework**: [Angular v20.3.15](https://angular.dev)
- **Architecture**:
  - **Zoneless Change Detection**: Utilizing `provideZonelessChangeDetection()` for maximum performance and reduced overhead.
  - **Signal-First Reactivity**: extensive use of Angular Signals for state management.
  - **Standalone Components**: No NgModules; fully tree-shakable architecture.
- **UI Library**: Angular Material v20.2.14
- **Hosting**: Firebase Hosting

### **Backend (Serverless)**

- **Runtime**: Node.js v24 (via Firebase Cloud Functions)
- **Platform**: Firebase (Auth, Firestore, Analytics, Functions)
- **Language**: TypeScript v5.9

---

## 🛠️ Features

- **Public Portal**:
  - View State Legislation (Default: New York)
  - Bill Details & Tracking
  - Legislative Member Profiles
- **User Accounts**:
  - Secure Authentication (Firebase Auth)
  - User Profiles
- **Admin Dashboard** (Protected):
  - User Management (Add/Remove Admins)
  - Bill Management (Add/Remove Bills manually)

---

## ⚙️ Getting Started

### Prerequisites

Ensure your development environment is set up with:

- **Node.js**: v24.x (Required for backend functions)
- **npm**: v10+
- **Angular CLI**: `npm install -g @angular/cli@20`
- **Firebase CLI**: `npm install -g firebase-tools`

### Installation

1. **Clone the repository**:

   ```bash
   git clone [https://github.com/legislative-tracker/reimagined-parakeet.git](https://github.com/legislative-tracker/reimagined-parakeet.git)
   cd legislative-tracker
   ```

2. **Install dependencies**:
   This project uses a monorepo-style structure. You need to install dependencies for both the frontend and backend.

   ```bash
   # Install root dependencies
   npm install

   # Install Frontend dependencies
   cd frontend
   npm install

   # Install Backend dependencies
   cd ../backend/functions
   npm install
   ```

---

## 💻 Development

We have configured convenience scripts in the root `package.json` to manage the full stack.

### Running the Frontend

Starts the Angular development server (utilizing `esbuild`) on port 4200.

```bash
npm run serve:frontend
# Access at http://localhost:4200
```
