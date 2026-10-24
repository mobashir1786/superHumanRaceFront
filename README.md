# Dashboard Builder

A React/Vite dashboard editor with draggable and resizable sections, text, images, and Chart.js bar/line charts. Layouts are fetched from and saved to the PHP/MySQL backend; the frontend does not store dashboard layouts in browser local storage.

## Live demo

- **Dashboard builder:** [https://super-human-race-server.infinityfree.io/](https://super-human-race-server.infinityfree.io/)
- **Dashboard API:** [https://super-human-race-server.infinityfree.io/dashboard-server/api/dashboards.php?id=1](https://super-human-race-server.infinityfree.io/dashboard-server/api/dashboards.php?id=1)

The API link returns the shared dashboard layout as JSON. The live frontend and API use the same InfinityFree domain.

> **Public shared dashboard:** There is no sign-in. Anyone can edit and replace the same dashboard, and upload images. Do not save test changes or store private or sensitive information.

## Using the dashboard

1. Open the [live dashboard](https://super-human-race-server.infinityfree.io/). It loads the current shared layout from the PHP API and MySQL database.
2. Select **Edit Dashboard** to open the builder.
3. Use the left-side buttons to add text, an image, a bar chart, a line chart, or a section. Select an element to change its content and properties in the right panel. Text supports bold, italic, and font size; chart titles and sample values can be edited or regenerated.
4. Drag elements to move them and use their resize handles to change their size. Sections can contain other elements.
5. Choose **Save & View Dashboard**. The browser sends the layout to the API, which saves it in MySQL; the frontend then fetches the saved layout and displays it. Image files are uploaded to the PHP backend, and their URLs are saved with the layout.
6. Choose **Edit Dashboard** to return to editing.

The live dashboard is shared by all visitors. If you want to try editing without affecting the live layout, run a separate local backend and frontend instead.

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

For local development, the frontend's default API URL is `http://localhost/dashboard-server/api`; configure `VITE_DASHBOARD_API_URL` in `.env.local` if your local API uses another URL.

## Deploy the complete app to InfinityFree

The PHP API should be installed in `/htdocs/dashboard-server`. Build the frontend to use that same host's API:

```sh
# PowerShell
$env:VITE_DASHBOARD_API_URL = "/dashboard-server/api"
npm run build
```

Upload the **contents** of `dist` to `/htdocs`, alongside (not inside or over) the existing `dashboard-server` directory. The relative API URL keeps dashboard reads, saves, and image uploads on the same origin.

## Deploy frontend to Vercel

Import this repository in Vercel using the Vite preset. Production builds default to the InfinityFree API URL. If using another PHP host, configure `VITE_DASHBOARD_API_URL` as an absolute API URL, for example `https://your-php-host.example/dashboard-server/api`. Vercel hosts only the frontend; the PHP/MySQL API remains separately hosted. The backend allows the production Vercel origin by default; set `DASHBOARD_ALLOWED_ORIGINS` or the server-only `config/database.php` `allowed_origins` setting if the frontend uses another domain.

This deployment has one public shared dashboard and no user accounts. Anyone can view, change, or replace its layout and upload images. Do not use it for private or sensitive content.

## Validation

```sh
npm run lint
npm run build
```
