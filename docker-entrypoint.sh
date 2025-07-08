#!/bin/sh
set -e

# Initialize database if not already
flask init-db || true

exec "$@"
