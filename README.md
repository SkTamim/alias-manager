# Rhino/Matrix Alias Manager

![Alias Manager Screenshot](https://i.imgur.com/your-screenshot-url.png) A modern, cloud-powered web application designed to help CAD designers, especially those using Rhino and Matrix, manage their command aliases efficiently. This tool replaces cumbersome text files with a fast, searchable, and cloud-synced interface, accessible from any device.

## ✨ Core Features

* **☁️ Cloud Sync with Firebase:** Your aliases are securely stored in your private cloud database, always in sync across all your devices.
* **🔐 Google Authentication:** Securely sign in with your Google account. Your data is private to you, protected by Firestore Security Rules.
* **🚀 Smart Import:** Intelligently parses your existing Rhino `.txt` alias files. It automatically cleans up messy commands and adds helpful descriptions for common shortcuts.
* **⚡ Instant Search:** Quickly find any alias by its shortcut, command, or description.
* **✏️ Full CRUD Operations:** Easily create, read, update, and delete your aliases through a clean, modern interface.
* **📤 Export to `.txt`:** Export your entire, updated alias list into a perfectly formatted `.txt` file, ready to be imported directly into Rhino or Matrix.
* **Modern Tech Stack:** Built with React, Vite, and Tailwind CSS for a fast and beautiful user experience.

## 🛠️ Tech Stack

* **Frontend:** [React.js](https://reactjs.org/) (with Vite)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Backend & Database:** [Google Firebase](https://firebase.google.com/) (Authentication & Firestore)
* **Routing:** [React Router](https://reactrouter.com/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (which includes npm) installed on your computer.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/alias-manager.git](https://github.com/your-username/alias-manager.git)
    cd alias-manager
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up your Firebase Configuration:**
    * In the root of your project, find the `firebaseConfig.js` file.
    * Make sure it contains your web app's Firebase configuration object, which you can get from your Firebase project settings.

    ```javascript
    // firebaseConfig.js
    import { initializeApp } from 'firebase/app';
    import { getFirestore } from 'firebase/firestore';
    import { getAuth } from 'firebase/auth';

    const firebaseConfig = {
      apiKey: "AIzaSy...xxxxxxxxxxx",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "123456789012",
      appId: "1:123456789012:web:xxxxxxxxxxxxxx"
    };

    const app = initializeApp(firebaseConfig);
    export const db = getFirestore(app);
    export const auth = getAuth(app);
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or a similar port).

## 🔥 Firebase Setup

For this project to work, your Firebase project must be configured correctly:

1.  **Authentication:** Google Sign-In must be enabled as a provider.
2.  **Firestore Database:** A Firestore database must be created.
3.  **Firestore Security Rules:** To ensure each user's data is private, your `firestore.rules` should be set to:
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Allow each user to access only their own 'aliases' collection
        match /users/{userId}/aliases/{aliasId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
    ```

## 📦 Deployment

To build the application for production, run:

```bash
npm run build
