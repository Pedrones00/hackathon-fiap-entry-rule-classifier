# Entry Rule Classifier

This repository contains a small Node.js/Express application that manages classification rules for accounting entries and uses them to analyse or clean up entry data via communication with an external account-entries service.


## Stack
- Node.js (ES modules)
- Express 5
- Sequelize + SQLite3

## Project structure
```
src/
  config/       # swagger and db setup
  controller/   # express controllers
  middlewares/  # validation & error handling
  model/        # DTOs and sequelize entities
  routes/       # express routes
  service/      # business logic
  utils/
  docs/         # OpenAPI specification (openapi.yaml)
index.js        # main app entrypoint
.env            # variables to run the project
```

## Prerequisites
- Podman (alternatively Docker)

## Running via Podman
Build the container image with:
```bash
podman build -t entry-rule-classifier .
```

Start a temporary container binding port 3002:
```bash
podman run --rm --init -p 3002:3002 --name service-rule-classifier entry-rule-classifier:latest
```

The API will be accessible at `http://localhost:3002` and documentation at `http://localhost:3002/docs`.

## API Documentation
The OpenAPI spec is available in `src/docs/openapi.yaml`. Visit `/docs` when the server is running to view the Swagger UI.

## Environment variables
- `DATABASE_PATH` — path to the SQLite file (default: `./storage/database.sqlite`).
- `DB_LOGGING` — `true` to enable Sequelize logging, `false` by default.
- `NODE_PORT` — server port (default: `3002`).

Additional environment variables used to integrate with external services:
- `BUDGET_SERVICE_URL` — base URL for the budget service used to verify categories (example: `http://budget-service:3000`).
- `BUDGET_SERVICE_VERIFY_ENDPOINT` — path (or path+query) to the endpoint that verifies if a budget category exists (example: `/budget/categories/verify`).
- `ACCOUNT_ENTRIES_SERVICE_URL` — base URL for the account-entries service used to fetch and update entries (example: `http://account-entries-service:3001`).
- `ACCOUNT_ENTRIES_ENDPOINT` — path to the entries resource used by this service (example: `/entries`).

## Database Schema

Table: rules (model: rule)

### Columns and rules

- `id` (INTEGER)
  - Primary key, auto-increment, not null.
- `agency` (VARCHAR(4))
  - NOT NULL, numeric string, exactly 4 characters.
- `account` (VARCHAR(10))
  - NOT NULL, numeric string, 1–10 characters.
- `entryNamePattern` (VARCHAR(20))
  - NOT NULL, string, 1–20 characters.
- `category` (VARCHAR(50))
  - NOT NULL, string, 1–50 characters.

> **Note:** Sequelize configuration lives in `src/model/entity/rule.js` and explicitly sets the table name to `rules`.