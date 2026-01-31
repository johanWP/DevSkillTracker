
# Deploying DevSkillTracker to Firebase Hosting

This guide provides step-by-step instructions to deploy the DevSkillTracker application to Firebase Hosting.

## Prerequisites
-   You have already completed all the setup steps in `README.md`.
-   You have [Node.js and npm](https://nodejs.org/en/) installed.

## Step 1: Install the Firebase CLI
If you don't have it installed, open your terminal and run:
```bash
npm install -g firebase-tools
```

## Step 2: Log in to Firebase
Connect the CLI to your Firebase account:
```bash
firebase login
```

## Step 3: Initialize Firebase Hosting
1.  Navigate to your project's root directory.
2.  Run the initialization command:
    ```bash
    firebase init hosting
    ```
3.  Answer the questions as follows:
    -   **Are you ready to proceed?** -> `Y`
    -   **Which Firebase project?** -> `Use an existing project` and select your project.
    -   **What do you want to use as your public directory?** -> `dist` (This is the directory where Vite places the production build).
    -   **Configure as a single-page app?** -> `Y`
    -   **Set up automatic builds with GitHub?** -> `N`

This will create a `firebase.json` file. It should look like this:
```json
{
  "hosting": {
    "public": "dist",
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

## Step 4: Build the Application for Production
Before you can deploy, you need to create a production-ready build of your app. Vite compiles and optimizes all your files into the `dist` directory.
Run the following command in your project's root directory:
```bash
npm run build
```

## Step 5: Deploy to Firebase Hosting
Now that your production build is ready in the `dist` folder, deploy it by running:
```bash
firebase deploy
```
The CLI will upload the contents of the `dist` folder. Once complete, it will provide you with your public **Hosting URL**.

Open the URL in your browser to see your live application!

## Redeploying with Changes
Whenever you make changes, repeat steps 4 and 5:
1.  `npm run build`
2.  `firebase deploy`
