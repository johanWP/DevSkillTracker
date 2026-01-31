
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
-   [Node.js](https://nodejs.org/en/) (which includes npm) installed on your machine.
-   A modern web browser (e.g., Chrome, Firefox, Safari).

## Firebase Setup Instructions
*(These instructions remain the same. Ensure you have created your Firebase project, enabled Auth, set up Firestore, and applied security rules.)*

## Local Setup & Configuration

### 1. Get the Code
Download or clone all the project files to your local machine.

### 2. Install Dependencies
Open a terminal in the project's root directory and run the following command to install all the necessary packages:
```bash
npm install
```

### 3. Configure Environment Variables
Your Firebase API keys are sensitive and should not be committed to version control. This project uses a `.env` file to manage them securely.

1.  Find the file named `.env.example` in the project root.
2.  Create a copy of this file in the same directory and name it `.env`.
3.  Open the new `.env` file and replace the placeholder values (e.g., `YOUR_API_KEY`) with the actual configuration object you got when creating your web app in Firebase.
4.  The `.gitignore` file is already set up to ignore `.env`, so your keys will not be tracked by Git.

### 4. Configure Admin Emails
1.  Open the file `src/constants.ts`.
2.  Update the `ADMIN_EMAILS` array to include the emails of the admin users you created in the Firebase Authentication console.

    ```typescript
    // src/constants.ts

    export const ADMIN_EMAILS = [
      "admin1@company.com",
      "admin2@company.com",
      "testadmin@example.com"
      // ... up to 10 emails
    ].map(email => email.toLowerCase());
    ```

## Running the Application Locally
1.  Make sure all your configuration changes are saved.
2.  In your terminal, run the following command from the project root:
    ```bash
    npm run dev
    ```
3.  Vite will start the development server and provide you with a local URL (usually `http://localhost:5173`). Open this URL in your web browser.
4.  You should now see the login screen. The app will automatically reload in your browser whenever you save changes to a file.

## How to Test (Phase 1 Checklist)
-   [ ] **Login as Admin**: Use the credentials of an admin user you created. You should see the dashboard.
-   [ ] **Login as Non-Admin**: Create a user in Firebase Auth whose email is *not* in `ADMIN_EMAILS`. After logging in, you should be immediately logged out and see an authorization error.
-   [ ] **Add Developer (Success)**: Navigate to "Add Developer", fill in the form, and save. Check your Firestore `devs` collection to confirm the new document was created.
-   [ ] **Add Developer (Duplicate)**: Try to add another developer with the same email address. The form should show an error message, and no data should be overwritten.
-   [ ] **View Developers (Empty)**: If the `devs` collection is empty, the "Developers" view should show a "No developers found" message.
-   [ ] **View Developers (Populated)**: After adding a developer, the "Developers" view should display them in the table.
-   [ ] **View Settings**: The "Settings" view should display the list of skills from your `config/skillsCatalog` document.
-   [ ] **Logout**: The logout button should sign you out and return you to the login screen.
