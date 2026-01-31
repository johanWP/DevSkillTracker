
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
-   **Fully Tested**: Includes both unit tests (Jest) and end-to-end tests (Playwright).

## Prerequisites
-   A [Google Firebase](https://firebase.google.com/) account.
-   [Node.js](https://nodejs.org/en/) (which includes npm) installed on your machine.
-   A modern web browser (e.g., Chrome, Firefox, Safari).

## Firebase Setup Instructions
*(These instructions remain the same. Ensure you have created your Firebase project, enabled Auth, set up Firestore, and applied security rules.)*

## Local Setup & Configuration
*(Steps 1-4 for installing dependencies, configuring .env, and setting admin emails remain the same.)*

## Running the Application Locally
1.  Make sure all your configuration changes are saved.
2.  In your terminal, run the following command from the project root:
    ```bash
    npm run dev
    ```
3.  Vite will start the development server and provide you with a local URL (usually `http://localhost:5173`). Open this URL in your web browser.

## Testing the Application

### Unit Tests

This project includes a comprehensive suite of unit tests built with Jest and React Testing Library to ensure individual components and functions work correctly in isolation.

**Important**: The unit tests run against a mocked version of the Firebase services, meaning they **do not** interact with your live database. They are safe and fast to run at any time.

1.  Open your terminal in the project's root directory.
2.  Run the following command:
    ```bash
    npm test
    ```

### End-to-End (E2E) Testing

End-to-end tests simulate real user workflows in a browser. This project uses **Playwright** to automatically launch a browser, navigate the application, and verify that everything from the UI to the Firebase backend works together correctly.

**E2E Test Prerequisites:**

Before running the E2E tests for the first time, you **must** create two users in your **Firebase Authentication Console** with the following credentials. The tests will use these accounts to simulate login attempts.

1.  **Admin User:**
    *   **Email**: `testadmin@example.com`
    *   **Password**: `password123`
2.  **Non-Admin User:**
    *   **Email**: `testuser@example.com`
    *   **Password**: `password123`

**How to Run the E2E Tests:**

1.  Ensure your Vite development server is **not** running in another terminal. Playwright will start it automatically.
2.  Run the following command:
    ```bash
    npm run test:e2e
    ```
3.  Playwright will install the necessary browser binaries on the first run, start the dev server, open a browser, execute the tests, and then shut down. A detailed HTML report will be generated in the `playwright-report` folder.

## How to Test (Phase 1 Checklist)
-   [ ] **Login as Admin**: Use the credentials of an admin user you created. You should see the dashboard.
-   [ ] **Login as Non-Admin**: Create a user in Firebase Auth whose email is *not* in `ADMIN_EMAILS`. After logging in, you should be immediately logged out and see an authorization error.
-   [ ] **Add Developer (Success)**: Navigate to "Add Developer", fill in the form, and save. Check your Firestore `devs` collection to confirm the new document was created.
-   [ ] **Add Developer (Duplicate)**: Try to add another developer with the same email address. The form should show an error message, and no data should be overwritten.
-   [ ] **View Developers (Empty)**: If the `devs` collection is empty, the "Developers" view should show a "No developers found" message.
-   [ ] **View Developers (Populated)**: After adding a developer, the "Developers" view should display them in the table.
-   [ ] **View Settings**: The "Settings" view should display the list of skills from your `config/skillsCatalog` document.
-   [ ] **Logout**: The logout button should sign you out and return you to the login screen.
