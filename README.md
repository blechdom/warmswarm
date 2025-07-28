# WarmSwarm 🐝

A mobile-optimized web platform for creating and joining coordinate groups (swarms).

## Features

- **Create Swarms**: Set up new coordination groups with privacy settings
- **Join Swarms**: Connect to existing swarms using invite codes
- **Browse Public Swarms**: Discover public coordination groups
- **Mobile-First Design**: Optimized for iPhone and Android devices
- **Real-time Database**: PostgreSQL backend with Node.js API

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Styled Components
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: PostgreSQL with UUID primary keys
- **Deployment**: Docker & Docker Compose

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Run with Docker

1. **Clone and navigate to the project**:
   ```bash
   git clone <repository-url>
   cd warmswarm
   ```

2. **Start all services**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3333
   - Backend API: http://localhost:4444
   - Database: localhost:5432

### Development Mode

1. **Start the database**:
   ```bash
   docker-compose up postgres
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd backend && npm install
   ```

3. **Run services**:
   ```bash
   # Frontend (in root directory)
   npm run dev

   # Backend (in backend directory)
   npm run dev
   ```

## API Endpoints

### Swarms
- `GET /api/swarms` - Get all public swarms
- `POST /api/swarms` - Create new swarm
- `GET /api/swarms/:inviteCode` - Get swarm by invite code
- `GET /api/swarms/:inviteCode/members` - Get swarm members

### Joining
- `POST /api/swarms/:inviteCode/join` - Join existing swarm

### Health Check
- `GET /health` - API health status

## Database Schema

### Swarms Table
- `id` - UUID primary key
- `name` - Swarm name
- `description` - Swarm description
- `privacy` - public/private/hidden
- `category` - event/project/social/work/other
- `invite_code` - Unique invite code
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Swarm Members Table
- `id` - UUID primary key
- `swarm_id` - Foreign key to swarms
- `nickname` - Member nickname
- `joined_at` - Timestamp
- `is_creator` - Boolean flag

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:4444)

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 4444)

## Sample Data

The database initializes with sample swarms:
- **Morning Joggers** (public, social) - Code: JOGGING123
- **Dev Team Alpha** (private, work) - Code: DEVTEAM456
- **Book Club Readers** (public, social) - Code: BOOKS789

## Docker Services

- **postgres**: PostgreSQL 15 database
- **backend**: Node.js API server
- **frontend**: Next.js React application

## Development Notes

- Frontend runs on port 3333
- Backend runs on port 4444
- Database runs on port 5432
- All services communicate through Docker network
- Data persists in Docker volumes

## Future Enhancements

- Real-time messaging within swarms
- User authentication and profiles
- Location-based swarm discovery
- Push notifications
- Mobile app versions
