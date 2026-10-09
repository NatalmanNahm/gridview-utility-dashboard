# Publish GridView to GitHub

## 1. Verify locally

```bash
npm install
npm test
npm run build
npm run dev
```

Open the browser and test keyboard navigation, the form, outage status changes, map selection, and responsive layouts. Do not publish until build errors are resolved. Avoid including real customer data or employer code.

## 2. Capture screenshots

Create a `screenshots/` folder and save actual screenshots as:

- `dashboard-desktop.png`
- `dashboard-mobile.png`
- `outage-details.png`

Update `README.md` to display the first screenshot. Do not use stock imagery or generated mockups as evidence of a running app.

## 3. Review your changes

Make a few meaningful, understandable improvements and commit them. Examples: fix a keyboard navigation issue, improve a responsive breakpoint, refine a map selection behavior, or add a regression test. Document only what you actually changed.

## 4. Create the GitHub repository

In GitHub, choose **New repository** and name it `gridview-utility-dashboard`. Set visibility to **Public** if you want Alley reviewers to access it without an invitation. When creating an empty remote repository, do not initialize it with a README because this project already has one.

From Terminal in the project folder:

```bash
git init
git add .
git commit -m "Prepare GridView portfolio code sample"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gridview-utility-dashboard.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. GitHub may request authentication via a browser, credential manager, or personal access token; a regular account password is not accepted for Git over HTTPS.

If the folder already has a Git repository, skip `git init`, inspect `git remote -v`, and avoid adding a duplicate remote.

## 5. Final review

- Open the public GitHub link in a private/incognito browser window.
- Confirm README images render and source files are visible.
- Confirm `node_modules`, `dist`, secrets, and local `.env` files are not committed.
- Re-run tests and build after your final code changes.
- Use the repository's **specific URL** in Alley's code-sample field, not just your GitHub profile.
- Be ready to explain what you implemented personally, how map selection works, why localStorage was chosen, and what you would change for production.

## Optional live demo

You can later deploy the static Vite build to a frontend host, but a live deployment is not necessary to provide an inspectable GitHub code sample. If deploying, review the external tile provider's usage policies and verify the site loads over HTTPS.
