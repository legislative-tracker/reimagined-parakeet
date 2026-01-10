# Legislative Tracker PWA

**A modern Progressive Web App for tracking legislative activity, built on Angular v20 and
Firebase.**

The Legislative Tracker provides U.S. organizations with a customizable platform upon which to
promote select bills that align with their mission and core values.

## 🛠️ Features

The Tracker currently offers the following features for the state of New York:

- **Public Portal**:
  - View Legislation
  - Bill Details & Cosponsors
  - Legislative Member Profiles & Bill Sponsorship
- **User Accounts**:
  - Secure Authentication (Firebase Auth)
  - User Profiles
  - Address Lookup to Identify Home Districts & Representatives
- **Admin Dashboard** (Protected):
  - User Management (Add/Remove Admins)
  - Bill Management (Add/Remove Tracked Bills)
  - Customizable Global App Config (Org details, Branding & Theme, Resources & Links)

If you would like to see the Tracker implement a specific state, please consider
[contributing](CONTRIBUTING.md) to or sponsoring this project.

## 🚀 Tech Stack & Architecture

### **Frontend**

- **Framework**: [Angular v20.3.15](https://angular.dev)
- **Architecture**:
  - **Zoneless Change Detection**: Utilizing `provideZonelessChangeDetection()` for maximum
    performance and reduced overhead.
  - **Signal_First Reactivity**: extensive use of Angular Signals for state management.
  - **Standalone Components**: No NgModules; fully tree_shakable architecture.
- **UI Library**: [Angular Material v20.2.14](https://material.angular.dev/)
- **Backend Integration**:
  [AngularFire v20.0.1](https://github.com/angular/angularfire?tab=readme_ov_file#readme)
- **Hosting**: Firebase Hosting

### **Backend (Serverless)**

- **Runtime**: Node.js v24 (via Firebase Cloud Functions)
- **Platform**: Firebase (Auth, Firestore, Analytics, Functions)
- **Language**: TypeScript v5.9

## ⚙️ Getting Started

### Prerequisites

Ensure your development environment is set up with:

- **Node.js**: v24.x (Required for backend functions)
- **npm**: v10+
- **Angular CLI**: `npm install -g @angular/cli@20`
- **Firebase CLI**: `npm install -g firebase_tools`

You'll also need API Keys for the following 3rd Party Services:

- **OpenStates.org** (now Plural): <https://docs.openstates.org/api_v3/>
- **Google Geocoding**: <https://developers.google.com/maps/documentation/geocoding/start>
- **GitHub Actions**:
  <https://docs.github.com/en/actions/how_tos/write_workflows/choose_what_workflows_do/use_secrets>
- **States that you plan to implement**:
  - **New York**: <https://legislation.nysenate.gov/static/docs/html/index.html>

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/legislative_tracker/reimagined-parakeet.git
   cd reimagined-parakeet
   ```

1. **Install dependencies**: Because this is a monorepo-style project we've included a postinstall
   npm script to ensure dependencies are installed at all levels of the project. As such, you can
   simply run `npm i` in the project root (though it'll take a while).

   ```bash
   npm install
   ```

### Configuration

#### Firebase

1. Login & set project name as default

   ```bash
   # Login to Firebase
   firebase login

   # Set the active project (matches "default" in your .firebaserc)
   firebase use <YOUR_FIREBASE_PROJECT_NAME>
   ```

1. Set your secrets

   ```bash
   # API Key for OpenStates (Legislative Data)
   firebase functions:secrets:set OPENSTATES_KEY

   # API Key for Google Maps (Geocoding/District lookup)
   firebase functions:secrets:set GOOGLE_MAPS_KEY

   # API Key for GitHub Actions (PR & Merge_Main Automation)
   firebase functions:secrets:set GITHUB_BOT_TOKEN
   ```

   ```bash
   # API Key for New York State (State Legislative Data)
   firebase functions:secrets:set NY_SENATE_KEY
   ```

   You should also consider adding your secrets to `backend/functions/.secret.local` for use with
   Firebase Emulators during testing.

#### Google Cloud

1. Set the project target

   ```bash
   gcloud config set project <YOUR_FIREBASE_PROJECT_NAME>
   ```

1. Enable the Google Cloud APIs

   ```bash
   gcloud services enable \
     cloudfunctions.googleapis.com \
     run.googleapis.com \
     artifactregistry.googleapis.com \
     cloudbuild.googleapis.com \
     secretmanager.googleapis.com \
     logging.googleapis.com
   ```

1. Grant Secret Accessor Permissions

   ```bash
   # Get your Project Number
   PROJECT_NUMBER=$(gcloud projects describe <YOUR_FIREBASE_PROJECT_NAME> --format="value(projectNumber)")

   # Grant the 'Secret Accessor' role to the default Compute Engine Service Account
   gcloud projects add-iam-policy-binding <YOUR_FIREBASE_PROJECT_NAME> \
     --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   ```

#### Add Firebase project to frontend

1. Sign into Firebase Console & select your project
1. Navigate to Project Settings > Your apps
1. Under **SDK setup and configuration** Select **Config**, then copy the config object to
   `frontend/public/config.json` with the following format:

   ```json
   {
     "production": true,
     "firebase": {
       "projectId": "",
       "appId": "",
       "databaseURL": "",
       "storageBucket": "",
       "apiKey": "",
       "authDomain": "",
       "messagingSenderId": "",
       "measurementId": "",
       "projectNumber": "",
       "version": "2"
     }
   }
   ```

1. You can now build and deploy your project

   ```bash
   npm run build
   firebase deploy
   ```

#### Add your first Admin user

**This should be done AFTER deploying the project to Firebase.**

1. Navigate to `https://<YOUR_PROJECT_URL>/login` and sign in with your Auth Provider of choice\*  
   \*(**Currently the only available Auth Provider is Google** We intend to implement others in the
   near future)
1. Start up the Firebase Functions Shell

   ```bash
   cd backend/functions
   firebase functions:shell
   ```

1. Paste the following into the Shell prompt

   ```js
   // 1. Import the Auth helper (v10+ modular syntax)
   const { getAuth } = require("firebase-admin/auth");

   // 2. Find your user by email (replace with your actual email)
   getAuth()
     .getUserByEmail("<YOUR_EMAIL@EXAMPLE.COM>")
     .then((user) => {
       // 3. Set the 'admin' claim
       return getAuth().setCustomUserClaims(user.uid, { admin: true });
     })
     .then(() => {
       console.log("✅ Success! User is now an admin.");
     })
     .catch((err) => {
       console.error("❌ Error:", err);
     });
   ```

1. Go back to your browser and sign out, then sign back in to access the Admin panel
1. Navigate to /admin to set up your organization's branding, set up other users as Admins, and
   start adding bills to track!
