# Dashboard UI

Angular frontend for the lictracker build dashboard. Shows the live deployed
build tag for dev, QA, and prod, and lets you promote a QA build to prod.

## Setup

    npm install
    npm start   # http://localhost:4200

## Config

Set `apiUrl` in `src/environments/environment.ts` (dev) and
`environment.prod.ts` (prod) to point at the Dashboard Service Cloud Run URL.

## Build

    npm run build
