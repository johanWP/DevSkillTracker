
# DevSkillTracker - Phase 1

## Project Overview
DevSkillTracker is a secure internal web application designed for managing a database of developers and their skills. This is Phase 1 of the project, focusing on the core scaffolding: Firebase setup, admin-only authentication, and basic CRUD (Create, Read) operations for developer records.

## Features (Phase 1)
-   **Admin-Only Access**: Secure login using Firebase Authentication (Email/Password).
-   **Developer Database**: A Firestore collection to store developer profiles.
-   **Skill Management**: Dynamic skills list populated from a Firestore configuration document.
-   **Basic CRUD**:
    -   **Create**: Add new developers with their skills and details.
    -   **Read**: View a list of all developers.
-   **Simple UI**: A clean, functional interface built with React and Tailwind CSS.
-   **Secure by Default**: Firestore security rules to ensure only authorized admins can access data.

## Prerequisites
-   A [Google Firebase](https://firebase.google.com/) account.
-   A modern web browser (e.g., Chrome, Firefox, Safari).

## Firebase Setup Instructions

Follow these steps to configure the Firebase backend for the application.

### 1. Create a Firebase Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **Add project** and follow the on-screen instructions to create a new project.

### 2. Create a Web App
1.  Inside your new project, click the Web icon (`</>`) to add a new web app.
2.  Give your app a nickname (e.g., "DevSkillTracker Web").
3.  Click **Register app**.
4.  Firebase will provide you with a `firebaseConfig` object. **Copy this object.** You will need it in the "Local Setup" steps.

### 3. Enable Authentication
1.  In the Firebase Console, go to the **Authentication** section (under Build).
2.  Click **Get started**.
3.  On the **Sign-in method** tab, select **Email/Password** from the list of providers.
4.  Enable it and click **Save**.

### 4. Create Admin Users
You must manually create user accounts for your admins.
1.  In the **Authentication** section, go to the **Users** tab.
2.  Click **Add user**.
3.  Enter the email and a strong password for an admin user.
4.  Repeat for all admin emails you plan to use.

### 5. Set up Firestore Database
1.  In the Firebase Console, go to the **Firestore Database** section (under Build).
2.  Click **Create database**.
3.  Choose **Start in production mode** and click **Next**.
4.  Select your desired Firestore location and click **Enable**.

### 6. Create Firestore Collections & Documents
You need to manually create the initial configuration collection.
1.  Go to the **Firestore Database** data viewer.
2.  Click **+ Start collection**.
3.  For **Collection ID**, enter `config`.
4.  Click **Next**.
5.  For **Document ID**, enter `skillsCatalog`.
6.  Add a field with the following details:
    -   **Field name**: `skills`
    -   **Field type**: `array`
    -   **Field value**: Add the initial list of skills as strings. You can copy the array below.
        ```json
        [
          "JavaScript", "TypeScript", "Node.js", "React", "Python",
          "AWS", "Azure", "GCP", "DevOps", "Kubernetes", "n8n", "QA", "Data Engineering"
        ]
        ```
7.  Click **Save**.

### 7. Apply Security Rules
1.  In the **Firestore Database** section, go to the **Rules** tab.
2.  Replace the default rules with the contents of the `firestore.rules` file provided in this project.
3.  **Important**: Make sure the admin emails in the `isAdmin()` function of the rules match the ones you will use in the frontend code.
4.  Click **Publish**.

## Local Setup & Configuration

### 1. Get the Code
Download or clone all the project files (`.html`, `.tsx`, `.ts`, etc.) to your local machine.

### 2. Configure Firebase in the App
1.  Open the file `services/firebaseService.ts`.
2.  Find the `firebaseConfig` object placeholder.
3.  Replace the placeholder with the configuration object you copied when creating your web app in Firebase.

    ```typescript
    // services/firebaseService.ts

    // TODO: Replace with your Firebase config
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcd..."
    };
    ```

### 3. Configure Admin Emails
1.  Open the file `constants.ts`.
2.  Update the `ADMIN_EMAILS` array to include the emails of the admin users you created in the Firebase Authentication console.

    ```typescript
    // constants.ts

    export const ADMIN_EMAILS = [
      "admin1@company.com",
      "admin2@company.com",
      "testadmin@example.com"
      // ... up to 10 emails
    ].map(email => email.toLowerCase());
    ```

## Running the Application
This project is a single-page application and requires no local server or build step.
1.  Make sure all your configuration changes are saved.
2.  Open the `index.html` file directly in your web browser.
3.  You should see the login screen.

## How to Test (Phase 1 Checklist)
-   [ ] **Login as Admin**: Use the credentials of an admin user you created. You should see the dashboard.
-   [ ] **Login as Non-Admin**: Create a user in Firebase Auth whose email is *not* in `ADMIN_EMAILS`. After logging in, you should be immediately logged out and see an authorization error.
-   [ ] **Add Developer (Success)**: Navigate to "Add Developer", fill in the form, and save. Check your Firestore `devs` collection to confirm the new document was created.
-   [ ] **Add Developer (Duplicate)**: Try to add another developer with the same email address. The form should show an error message, and no data should be overwritten.
-   [ ] **View Developers (Empty)**: If the `devs` collection is empty, the "Developers" view should show a "No developers found" message.
-   [ ] **View Developers (Populated)**: After adding a developer, the "Developers" view should display them in the table.
-   [ ] **View Settings**: The "Settings" view should display the list of skills from your `config/skillsCatalog` document.
-   [ ] **Logout**: The logout button should sign you out and return you to the login screen.
