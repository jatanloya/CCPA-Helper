# CCPA-Helper

A DSAR (Data Subject Access Request) middleware API for CCPA compliance. Helps manage and look up company privacy rights including Right to Know (RTK), Right to Delete (RTD), and Right to Opt-Out (RTO).

## Quick Start

```bash
# Clone and install
cd api
npm install

# Configure environment
cp ../.env.example ../.env
# Edit ../.env with your MongoDB connection string

# Run in development
npm run dev

# Run in production
npm start
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `8000` | Server port |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `CORS_ORIGIN` | No | `*` | Allowed CORS origin |

## API Endpoints

### Health Check

```
GET /api/health
```

Returns server and database status.

### Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/records` | List/filter records with pagination |
| `GET` | `/api/records/search?q=term` | Full-text search |
| `GET` | `/api/records/:id` | Get record by ID |
| `POST` | `/api/records` | Create a new record |
| `PUT` | `/api/records/:id` | Update a record |
| `DELETE` | `/api/records/:id` | Delete a record |
| `GET` | `/api/data?url=xxx` | Legacy lookup by URL |

### Query Parameters (GET /api/records)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `url` | string | - | Filter by exact mainURL |
| `company` | string | - | Filter by company name (case-insensitive) |
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Results per page (max 100) |

### Examples

```bash
# Create a record
curl -X POST http://localhost:8000/api/records \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Example Corp",
    "mainURL": "https://example.com/",
    "dateOfPolicy": "2024-01-15",
    "CCPA": true,
    "clicks": 0,
    "rtk": { "exists": true, "mechanism": "Form", "url": "https://example.com/privacy" },
    "rtd": { "exists": false },
    "rto": { "exists": true, "mechanism": "Manual", "url": "https://example.com/opt-out" }
  }'

# List records with pagination
curl http://localhost:8000/api/records?page=1&limit=10

# Search records
curl http://localhost:8000/api/records/search?q=example

# Get by ID
curl http://localhost:8000/api/records/64a1b2c3d4e5f6789abcdef0

# Health check
curl http://localhost:8000/api/health
```

## Development

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint
npm run lint

# Seed sample data
npm run seed
```

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose 9)
- **Validation:** Zod
- **Security:** Helmet, CORS, express-rate-limit
- **Testing:** Vitest, Supertest, mongodb-memory-server
- **CI:** GitHub Actions
