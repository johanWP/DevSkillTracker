
# Deploying DevSkillTracker to Firebase Hosting

This guide provides step-by-step instructions to deploy the DevSkillTracker application to Firebase Hosting, making it accessible via a public URL.

It is assumed that you have already completed all the setup steps outlined in the `README.md` file.

## Prerequisites
-   You must have [Node.js and npm](https://nodejs.org/en/) installed on your machine.
-   You must have a Firebase project with Authentication and Firestore configured as per the `README.md`.

## Step 1: Install the Firebase CLI
The Firebase Command Line Interface (CLI) is a tool for managing, viewing, and deploying your Firebase projects. If you don't have it installed, open your terminal or command prompt and run the following command:

```bash
npm install -g firebase-tools
```
To verify the installation was successful, run:
```bash
firebase --version
```
This should output the version number of the Firebase CLI.

## Step 2: Log in to Firebase
Next, you need to connect the CLI to your Firebase account. Run the following command in your terminal:

```bash
firebase login
```
This will open a new browser window, prompting you to log in with your Google account and grant permissions to the Firebase CLI.

## Step 3: Initialize Firebase Hosting in Your Project
1.  Navigate to the root directory of your DevSkillTracker project (the folder containing `index.html`).
2.  Run the following command to start the initialization process:

    ```bash
    firebase init hosting
    ```
3.  You will be guided through a series of questions. Use the answers below:

    -   **Are you ready to proceed? (Y/n)**
        > Press `Y` and Enter.

    -   **Which Firebase project do you want to associate with this directory?**
        > Select `Use an existing project`.

    -   **Select a default Firebase project for this directory:**
        > Use the arrow keys to select the Firebase project you created for this application (e.g., `devskilltracker-12345`) and press Enter.

    -   **What do you want to use as your public directory?**
        > Type `.` (a single period) and press Enter. This tells Firebase that your `index.html` and other public files are in the current root directory.

    -   **Configure as a single-page app (rewrite all urls to /index.html)? (y/N)**
        > Press `Y` and Enter. This is crucial for single-page applications to handle routing correctly.

    -   **Set up automatic builds and deploys with GitHub? (y/N)**
        > Press `N` and Enter. For this guide, we will stick to manual deployment.

After completing these steps, two new files will be created in your project: `.firebaserc` (which links the directory to your project) and `firebase.json` (which contains your hosting configuration).

Your `firebase.json` file should look like this:
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Step 4: Deploy the Application
Now you are ready to deploy your app. Run the following command in your project's root directory:

```bash
firebase deploy
```

The CLI will upload your project files to Firebase Hosting. Once the process is complete, it will display a success message and your public **Hosting URL**.

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project-id/overview
Hosting URL: https://your-project-id.web.app
```

## Step 5: Access Your Live App
Copy the **Hosting URL** provided by the CLI and open it in your web browser. Your DevSkillTracker application is now live and accessible to anyone with the link!

## Redeploying with Changes
Whenever you make changes to your application's code (e.g., updating the `.tsx` or `.html` files), you can push the updates to your live site by simply running the `firebase deploy` command again from your project's root directory.
