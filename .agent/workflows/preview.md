---
description: How to preview your website before committing to GitHub
---

To see your changes before you commit and push to GitHub, you have two options:

### 1. Local Preview (Recommended for Development)
I have set up a root `package.json` that allows you to run all parts of your blog (Server, Client, and Admin) at once.

1.  Open your terminal in the project root (`c:\website-2\blog`).
2.  Run the following command to start everything:
    ```bash
    npm run dev
    ```
3.  This will start:
    -   **Backend** on [http://localhost:5000](http://localhost:5000) (or your configured port)
    -   **Frontend** on [http://localhost:5173](http://localhost:5173)
    -   **Admin Panel** on [http://localhost:5174](http://localhost:5174)

### 2. Cloud Preview (Without Committing)
If you want a shareable Vercel URL **without** pushing to GitHub:

1.  Install the Vercel CLI if you haven't:
    ```bash
    npm i -g vercel
    ```
2.  Navigate to the folder you want to preview (e.g., `client` or `server`).
3.  Run the command:
    ```bash
    vercel
    ```
4.  Follow the prompts to link the project. Vercel will give you a **Preview URL** immediately.

### 3. Git Branch Preview (The Vercel Way)
Since your project is already connected to GitHub:

1.  Create a new branch: `git checkout -b feature-test`
2.  Push your changes to this branch: `git push origin feature-test`
3.  Vercel will automatically create a **Preview Deployment** for this branch and post the link in your GitHub Pull Request.
4.  Only merge to `main` when you are happy with the preview!
