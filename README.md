
  # 3D Printer Filament Tracker

  This is a code bundle for 3D Printer Filament Tracker. The original project is available at https://www.figma.com/design/B7RFn90JNWhqly7KCYwlQk/3D-Printer-Filament-Tracker.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Cloud storage (optional)

  To sync filaments and printed parts across devices, use **Firebase Firestore**:

  1. Create a project at [Firebase Console](https://console.firebase.google.com/).
  2. Enable **Firestore Database** (Create database → Start in test mode or set rules).
  3. Register a **Web app** in Project settings and copy the config.
  4. Copy `.env.example` to `.env` and set the `VITE_FIREBASE_*` variables.
  5. Deploy Firestore rules (optional): `firebase deploy --only firestore` (requires Firebase CLI and `firestore.rules` in the project).
  6. Restart the dev server. Data will load from and save to Firestore; changes sync in real time across tabs and devices.

  Without Firebase config, the app runs with local-only (in-memory) data and seed content.
  