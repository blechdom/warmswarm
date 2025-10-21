# WarmSwarm Quick Start Guide

## Ports Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend (Next.js) | 3444 | http://localhost:3444 |
| Backend (Express) | 4444 | http://localhost:4444 |
| PostgreSQL | 5433 | localhost:5433 |

## Start Development Environment

### 1. Start Database & Backend

```bash
docker compose up -d
```

This starts:
- PostgreSQL on port 5433
- Backend API on port 4444

### 2. Start Frontend

```bash
npm run dev
```

Frontend runs on **port 3444** (not 3000)

## Access WarmSwarm

### Main Pages

- **Home**: http://localhost:3444/
- **Create Swarm**: http://localhost:3444/create
- **Join Swarm**: http://localhost:3444/join
- **My Swarms**: http://localhost:3444/swarms
- **Live Performance**: http://localhost:3444/live

### Telebrain-Style Pages

- **Telebrain Home**: http://localhost:3444/telebrain-home
- **Telebrain Perform**: http://localhost:3444/telebrain-perform

## Backend API

Base URL: `http://localhost:4444`

Endpoints:
- `GET /api/swarms` - List swarms
- `POST /api/swarms` - Create swarm
- `GET /api/swarms/:id` - Get swarm details

## Database Access

```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U postgres -d swarms

# View swarms
SELECT * FROM swarms;

# View content
SELECT * FROM swarm_content LIMIT 10;
```

## Helper Scripts

```bash
# Backup database
bash backend/scripts/backup_database.sh

# Restore database
bash backend/scripts/restore_database.sh

# Copy media files from Telebrain
bash backend/scripts/copy_telebrain_media.sh

# View Telebrain UI
bash view-telebrain-ui.sh
```

## Troubleshooting

### Port 3444 Already in Use

```bash
# Find what's using the port
lsof -i :3444

# Kill the process
kill -9 <PID>

# Or change the port in package.json:
"dev": "next dev --turbopack -p 3555"
```

### Backend Not Responding

```bash
# Check backend logs
docker compose logs backend

# Restart backend
docker compose restart backend
```

### Database Connection Issues

```bash
# Check PostgreSQL status
docker compose ps postgres

# Restart database
docker compose restart postgres
```

## Environment Variables

No `.env` file needed for local development. Default values:

```
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/swarms
BACKEND_PORT=4444
FRONTEND_PORT=3444
```

## Next Steps

1. Create a swarm at http://localhost:3444/create
2. Join from another device/browser
3. Test live messaging
4. Explore the Telebrain UI theme
5. Check out the database schema in `DATABASE-SCHEMA.md`

## Documentation

- `README.md` - Project overview
- `DATABASE-SCHEMA.md` - Database structure
- `TELEBRAIN-ANALYSIS.md` - Telebrain feature analysis
- `TELEBRAIN-UI-GUIDE.md` - UI implementation guide
- `MEDIA-FILES.md` - Media file documentation
- `DATABASE-BACKUP-GUIDE.md` - Backup procedures
- `SYNCED-AUDIO.md` - Synchronized audio documentation
