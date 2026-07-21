# Portfolio site

[![Build and deploy](https://github.com/haddow64/portfoliosite/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/haddow64/portfoliosite/actions/workflows/deploy.yml)

React portfolio hosted on GitHub Pages and served at [haddow64.com](https://haddow64.com).

## Local development

Use Node.js 20.19 or newer.

```powershell
npm ci
npm run dev
```

The Vite development server runs the site under the `/portfoliosite/` base path.

## Verification

```powershell
npm run lint
npm test
npm run build
npm run preview
npm run test:integration
```

The integration check expects the preview at `http://127.0.0.1:4174/portfoliosite/` by default. Set `PREVIEW_URL` to use a different address.

## Deployment

Pushes to `master` run the GitHub Actions workflow in
`.github/workflows/deploy.yml`. The workflow installs the locked dependencies,
runs the automated checks, builds the site and deploys `dist` to GitHub Pages.
