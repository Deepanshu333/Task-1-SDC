# Deploying this project to Vercel

This project is a Create React App located in the `Client/` folder. The repository already includes a `vercel.json` at the repo root which configures Vercel to build the app from `Client/package.json` and serve the `build/` output.

This README contains step-by-step instructions for deploying using the Vercel Dashboard and the Vercel CLI, plus notes about environment variables and local build verification.

## Quick notes

- Framework: Create React App (react-scripts)
- Local build verified: run `npm ci` and `npm run build` inside `Client/` — build succeeded and produced `Client/build/`.
- The app requires Firebase environment variables (prefixed with `REACT_APP_`) — these must be set in Vercel.

## Environment variables (add these in Vercel Project Settings → Environment Variables)

Set the following for both Preview and Production (names must match code in `Client/src/firebase.js`):

- REACT_APP_FIREBASE_API_KEY
- REACT_APP_FIREBASE_AUTH_DOMAIN
- REACT_APP_FIREBASE_DATABASE_URL
- REACT_APP_FIREBASE_PROJECT_ID
- REACT_APP_FIREBASE_STORAGE_BUCKET
- REACT_APP_FIREBASE_MESSAGING_SENDER_ID
- REACT_APP_FIREBASE_APP_ID
- REACT_APP_FIREBASE_MEASUREMENT_ID

## Option A — Deploy via Vercel Dashboard (recommended first-time)

1. Go to https://vercel.com and sign in with GitHub/GitLab/Bitbucket.
2. Choose "Import Project" → pick your repository `Deepanshu333/Task-1-SDC`.
3. During import set these values (if Vercel does not auto-detect correctly):
   - Root Directory: `Client`  (or leave root and Vercel will use `vercel.json` at repo root)
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add the environment variables (see above).
5. Click Deploy.

Notes: If you keep `vercel.json` at repo root you can import the repo at root and Vercel will use that config to build from `Client/package.json`.

## Option B — Deploy via Vercel CLI (fast, from your machine)

Install the Vercel CLI and deploy from the `Client` folder:

```powershell
npm i -g vercel
cd Client
vercel login
vercel --prod
```

Follow the prompts to link to an existing Vercel project or create a new one. The CLI will run the build and upload the `build/` output.

To add environment variables via the CLI:

```powershell
cd Client
vercel env add REACT_APP_FIREBASE_API_KEY production
# follow prompts to paste the value
```

Repeat for each env var listed above.

## Local build verification (already done)

From PowerShell in the repo:

```powershell
cd Client
npm ci
npm run build
```

If the build succeeds the `Client/build/` directory will contain the static files.

## Accessibility & lint warnings seen during build

When I ran a local build it completed successfully but produced some warnings from ESLint (anchor href accessibility and unused variable warnings). These do not block the build but should be fixed when you have time.

## Vulnerabilities reported by `npm ci`

`npm ci` reported a handful of vulnerabilities in transitive dependencies. Those are common in older CRA templates. If you want, I can:

- Update vulnerable packages where safe (may require testing), or
- Upgrade the project from `react-scripts` to a newer template (larger change).

## Optional: GitHub Actions auto-deploy

If you prefer automatic deployments on push (instead of Vercel Git integration), I can add a GitHub Action that runs `npm ci`, `npm run build` in `Client/` and uses the Vercel CLI to deploy. Let me know if you'd like that.

## Done for you in this repo

- `vercel.json` — added at the repo root to instruct Vercel to build from `Client/package.json` and serve `build/` (already committed).
- Local build validated (successful) — no build changes required.

If you want, I can now:

1. Fix the ESLint warnings (small code edits) and re-run the build.
2. Attempt to automatically remediate `npm audit` issues where non-breaking.
3. Create a GitHub Action to build and deploy.

Tell me which (1, 2, or 3) you'd like next, or if you're ready I'll stop here and you can import to Vercel.
