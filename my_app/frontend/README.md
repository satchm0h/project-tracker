# Frontend

This folder contains the React Single Page Application.

## Setup

From this directory install dependencies and start the development server:

```bash
npm install
npm start
```

The app will be served by Vite on `http://localhost:5173` with hot reloading. API requests beginning with `/api` are proxied to the Flask backend running on port `5000`.

## Building for Production

Compile the application with:

```bash
npm run build
```

The optimized files are placed in `../static/` which Flask serves as its static folder.

## Folder Structure

```
frontend/
├── index.html           # HTML entry served by Vite
├── package.json         # NPM scripts and dependencies
├── src/                 # React application source
│   ├── App.jsx          # Routes and navigation
│   ├── main.jsx         # Entry point that mounts the app
│   ├── ProjectList.jsx  # Lists projects
│   ├── ProjectForm.jsx  # Create and edit projects
│   ├── LeaderList.jsx   # Lists development leaders
│   ├── services/
│   │   └── api.js       # Helper functions to call the Flask API
│   └── ...              # Styles, tests and other components
└── vite.config.js       # Build and dev server configuration
```

## Interaction with the Flask API

The SPA communicates with the backend through the helper functions in `src/services/api.js`. When running `npm start`, Vite proxies these calls to `http://localhost:5000`, so the frontend and Flask API work together seamlessly. In production, the compiled files under `my_app/static` are served by Flask and the same `/api` routes handle data requests.

## Styling

You can style components using your preferred approach:

- Import a framework like **Bootstrap** or **Tailwind** if you need a comprehensive UI toolkit.
- Alternatively, use local CSS modules. The project includes a `global.css` file for shared styles and a `ProjectList.module.css` example. Create additional `.module.css` files alongside components as needed.
