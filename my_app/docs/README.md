# Documentation

## API Routes

### Health Check
- **GET `/api/health`**
  - Response: `{"status": "ok"}`

### Projects
- **GET `/api/projects`**
  - Returns a list of projects.
- **POST `/api/projects`**
  - Body parameters:
    - `name` (string, required)
    - `description` (string, required)
    - `primary_contact_name` (string, required)
    - `primary_contact_email` (string, required)
    - `url` (string, optional)
    - `development_leader` (string, required)
  - Sample response:
    ```json
    {
      "id": 1,
      "name": "Example",
      "description": "A sample project",
      "primary_contact_name": "Bob",
      "primary_contact_email": "bob@example.com",
      "url": "http://example.com",
      "development_leader": "Alice"
    }
    ```
- **GET `/api/projects/<id>`**
  - Returns a single project or `404` if not found.
- **PUT `/api/projects/<id>`**
  - Accepts any of the project fields to update.
- **DELETE `/api/projects/<id>`**
  - Response: `{"status": "deleted"}`

### Development Leaders
- **GET `/api/leaders`**
  - Returns a list of leaders.
- **POST `/api/leaders`**
  - Body parameters:
    - `name` (string, required)
    - `email` (string, required)
- **GET `/api/leaders/<id>`**
  - Returns a single leader or `404` if not found.
- **PUT `/api/leaders/<id>`**
  - Accepts `name` and/or `email` to update.
- **DELETE `/api/leaders/<id>`**
  - Response: `{"status": "deleted"}`

## CLI Usage

All commands are available through the Flask CLI:

- `flask init-db` – initialize the SQLite database.
- `flask create-leader NAME EMAIL` – create a new development leader.
- `flask list-projects` – list all projects.
- `flask seed-data` – insert example leader and project.

## Database Models

### DevelopmentLeader
- `id` – primary key
- `name` – unique string
- `email` – string
- Relationship: one `DevelopmentLeader` has many `Project` records.

### Project
- `id` – primary key
- `name` – unique string
- `description` – text
- `primary_contact_name` – string
- `primary_contact_email` – string
- `url` – optional string
- `development_leader` – foreign key referencing `DevelopmentLeader.name`

## Development Setup & Workflow

Install dependencies and formatting tools:

```bash
pip install -r requirements.txt
pip install black isort flake8 mypy
```

Common tasks:

| Task            | Command                   |
|-----------------|---------------------------|
| Format code     | `black app/ tests/`       |
| Sort imports    | `isort app/ tests/`       |
| Run linter      | `flake8 app/`             |
| Type checking   | `mypy app/`               |
| Run tests       | `pytest`                  |
| Coverage report | `pytest --cov=app`        |


### SPA Development

The frontend is built with Vite. During development, run the dev server:

```bash
cd frontend && npm start
```

The Vite configuration proxies API requests under `/api` to the Flask app
running on port `5000`, so the SPA can communicate with the backend without
cross-origin issues.

## SPA Styling & Assets

The React frontend can be styled using your preferred approach:

- **CSS Frameworks** – Integrate libraries like **Bootstrap** or **Tailwind** by
  installing the packages in `frontend/` and importing their styles in
  `main.jsx`.
- **CSS Modules** – For simple custom styling, create `.module.css` files next
  to your components and import them as modules. Use a global stylesheet for
  app-wide rules.

The repository includes a `global.css` file imported in `main.jsx` and a sample
`ProjectList.module.css` demonstrating component-level styles.

## Production Deployment with Docker

1. Build the Docker image:

   ```bash
   docker build -t project-tracker .
   ```

2. Run the container:

   ```bash
   docker run -d -p 5000:5000 project-tracker
   ```

   The service will listen on port `5000` and serve the compiled SPA along with the API.

