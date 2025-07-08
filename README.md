# project-tracker

A simple web service to manage a list of projects within a development organization.

See [full documentation](my_app/docs/README.md) for API details, CLI usage and development workflow.

## Docker Deployment

Build the production image:

```bash
docker build -t project-tracker .
```

Run the container:

```bash
docker run -p 5000:5000 project-tracker
```

The application will be available on `http://localhost:5000`. The entrypoint automatically initializes the SQLite database on first run.
