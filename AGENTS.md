# AGENTS.md

## Overview

This document outlines the **agents** (components) of the project, their responsibilities, and best practices for contributing to the system. The application consists of:

* A **Flask** REST API backed by **SQLite**
* An **administrative CLI**
* A **React-based Single Page Application (SPA)**
* Supporting infrastructure for **linting**, **documentation**, and **automated testing**

---

## Project Structure

```
my_app/
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── views.py
│   ├── services/
│   ├── cli/
│   ├── database.py
│   └── config.py
├── static/
├── templates/
├── frontend/
│   ├── src/
│   └── ...
├── tests/
│   ├── unit/
│   └── integration/
├── docs/                       # Markdown-based documentation
├── run.py
├── requirements.txt
├── pyproject.toml              # For tool config (black, isort, mypy)
└── AGENTS.md
```

---

## Agents and Responsibilities

### 1. **Flask Web Server** (Agent: `app`)

* Hosts REST API endpoints
* Serves compiled SPA via `/static`
* Performs routing, authentication, error handling

### 2. **SQLite Engine** (Agent: `SQLite`)

* Lightweight storage
* Managed via SQLAlchemy in `models.py`

### 3. **Admin CLI** (Agent: `flask.cli`)

* Administrative tasks (`init-db`, `create-user`)
* Located in `app/cli/`

### 4. **Service Layer** (Agent: `services`)

* Encapsulates business logic
* Keeps view functions clean
* Unit tested separately

### 5. **Frontend SPA** (Agent: `SPA`)

* React/Vue frontend for user interaction
* Built assets are served by Flask
* Talks to Flask API using fetch/axios

### 6. **Tests** (Agent: `pytest`)

* Located in `tests/`
* Includes unit and integration suites
* Uses fixtures, mocks, and factory data

---

## Additional Guidance for Agents

### ✅ Linting & Formatting (Agent: `linter`)

* **Tools**:

  * `black` — Code formatting
  * `isort` — Import sorting
  * `flake8` — Linting for style and errors
  * `mypy` — Optional static typing
* **Setup**:

  ```bash
  pip install black isort flake8 mypy
  black app/ tests/
  isort app/ tests/
  flake8 app/
  mypy app/
  ```
* **CI Check**: Include linters in your CI workflow to ensure code quality before merging.

---

### 📚 Documentation (Agent: `docs`)

* **Backend Docs**:

  * Use **Markdown** in `docs/` folder
  * Include:

    * API endpoints (path, method, params)
    * CLI commands
    * Data model structure
    * Dev setup instructions
* **Frontend Docs**:

  * Include component docs using Storybook or JSDoc if applicable
* **README.md**:

  * Basic usage, local dev, and deployment instructions

---

### 🧪 Comprehensive Testing (Agent: `pytest`)

* **Test Types**:

  * **Unit Tests**: For services, models, utility functions
  * **Integration Tests**: For full API request flows (e.g., POST → DB → GET)
  * **CLI Tests**: Simulate CLI commands with `click.testing`
  * **Frontend Tests**: Use Jest or React Testing Library
* **Coverage Goals**:

  * Aim for **90%+** code coverage
  * Use `pytest-cov`:

    ```bash
    pytest --cov=app tests/
    ```
  * Generate HTML reports:

    ```bash
    pytest --cov=app --cov-report=html
    open htmlcov/index.html
    ```
* **Test Data**:

  * Use `pytest fixtures` and a temporary SQLite DB (`sqlite:///:memory:`)
  * Seed with `factory_boy` or similar tool

---

## Dev Workflow Checklist

| Task                        | Tool / Command                 |
| --------------------------- | ------------------------------ |
| Format code                 | `black .`                      |
| Sort imports                | `isort .`                      |
| Run linter                  | `flake8 .`                     |
| Run type checker            | `mypy app/`                    |
| Run tests                   | `pytest`                       |
| Run tests with coverage     | `pytest --cov=app`             |
| Start Flask app             | `flask run`                    |
| Start SPA dev server        | `cd frontend && npm start`     |
| Build SPA for prod          | `cd frontend && npm run build` |
| Build backend docs          | `cd docs && make html`         |

---

## Future Improvements

* Pre-commit hooks (`pre-commit` framework)
* API schema docs (e.g., Swagger/OpenAPI)
* GitHub Actions or GitLab CI/CD integration
* Containerization (Docker + Docker Compose)
* Staging/production deployment configs
