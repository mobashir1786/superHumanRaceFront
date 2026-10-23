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

4. The shared dashboard opens without sign-in. Anyone who can access it can edit its contents.

## Deploy frontend to Vercel

Import this repository in Vercel using the Vite preset. Production builds default to the InfinityFree API URL; if using another PHP host, configure:

```dotenv
VITE_DASHBOARD_API_URL=https://your-php-host.example/dashboard-server/api
```

The PHP/MySQL backend must be deployed separately; Vercel hosts this React frontend, not this LAMP API. The backend allows the production Vercel origin by default; set `DASHBOARD_ALLOWED_ORIGINS` or the server-only `config/database.php` `allowed_origins` setting if the frontend uses another domain.

This deployment has one public shared dashboard and no user accounts. Anyone can view, change, or replace its layout and upload images. Do not use it for private or sensitive content.

## Validation

```sh
npm run lint
npm run build
```
