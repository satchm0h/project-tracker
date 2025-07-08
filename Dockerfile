# Multi-stage build

# Stage 1: build frontend assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY my_app/frontend/package*.json ./
RUN npm ci
COPY my_app/frontend/ .
RUN npm run build

# Stage 2: build python app
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONUNBUFFERED=1

# Install dependencies
COPY my_app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY my_app/ ./

# Copy built frontend assets
COPY --from=frontend-builder /app/static ./static

# Add entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENV FLASK_APP=run.py
EXPOSE 5000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["gunicorn", "-b", "0.0.0.0:5000", "run:app"]
