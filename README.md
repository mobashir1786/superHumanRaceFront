# Dashboard Builder

A React/Vite dashboard editor with draggable and resizable sections, text, images, and Chart.js bar/line charts. Layouts are fetched from and saved to the PHP/MySQL backend; the frontend does not store dashboard layouts in browser local storage.

## Run locally

1. Set up the PHP/MySQL API by following the [backend setup guide](https://github.com/mobashir1786/superHumanRaceBackend#dashboard-builder-phpmysql-api).
2. Copy `.env.example` to `.env.local` and point it to the backend API:

   ```dotenv
   VITE_DASHBOARD_API_URL=http://localhost/dashboard-server/api
   ```

3. Install frontend dependencies and start Vite:

   ```sh
   npm install
   npm run dev
   ```

4. Sign in using the administrator password configured on the PHP server.

## Deploy frontend to Vercel

Import this repository in Vercel using the Vite preset, then configure the project environment variable:

```dotenv
VITE_DASHBOARD_API_URL=https://your-php-host.example/api
```

Set that API URL for the Vercel deployment environment and redeploy. On the PHP host, allow the exact Vercel origin in `DASHBOARD_ALLOWED_ORIGINS` or the server-only `config/database.php` `allowed_origins` setting. The PHP/MySQL backend must be deployed separately; Vercel hosts this React frontend, not this LAMP API.

## Validation

```sh
npm run lint
npm run build
```
