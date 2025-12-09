# Ticketmaster Clone

A full-stack ticketing application with microservices architecture, featuring user management, admin controls, enterprise services, and a frontend interface.

## Architecture

- **Frontend**: Angular application with Nginx
- **Backend Services**:
  - `admin-service` (Port 3001): Admin operations and Stripe integration
  - `users-service` (Port 3000): User management and authentication
  - `enterprise-service` (Ports 3002/3010/3011): Gateway, auth, and merchandise services
- **Database**: MongoDB with replica set
- **Reverse Proxy**: Nginx with Brotli/Gzip compression

## Prerequisites

- Node.js and pnpm
- MongoDB (for local development)
- Docker and Docker Compose (for containerized deployment)

## Environment Configuration

### Development Mode (Local)

For local development, create a `.env` file in each service directory based on the provided `.env.example` files:

#### Admin Service (Development)

Create `backend/admin-service/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/mydb
PORT=3001
HOST=127.0.0.1
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES_IN_HOURS=1
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN_DAYS=7
BCRYPT_HASH_RONUDS=10
STRIPE_SK=sk_test_your_stripe_secret_key
STRIPE_WHSEC=whsec_your_webhook_secret #automatic on docker
```

#### Users Service (Development)

Create `backend/users-service/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/mydb
PORT=3000
HOST=127.0.0.1
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES_IN_HOURS=1
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN_DAYS=7
```

#### Enterprise Service (Development)

Create `backend/enterprise-service/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/mydb
GATEWAY_PORT=3002
AUTH_PORT=3010
MERCH_PORT=3011
HOST=127.0.0.1
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES_IN_HOURS=600000
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN_DAYS=7
BCRYPT_HASH_RONUDS=10
```

### Production Mode (Docker Deployment)

For Docker deployment, create `.env.production` files in each service directory **and** a `.env` file in the docker directory based on the `.env.example` files:

#### Docker Environment

Create `backend/docker/.env`:

```env
STRIPE_SK=sk_test_your_stripe_secret_key
```

This file is used by Docker Compose for the Stripe CLI listener service (if enabled).

#### Admin Service (Production)

Create `backend/admin-service/.env.production`:

```env
MONGO_URI=mongodb://mongo:27017/mydb
PORT=3001
HOST=0.0.0.0
JWT_ACCESS_SECRET=your_production_access_secret
JWT_ACCESS_EXPIRES_IN_HOURS=1
JWT_REFRESH_SECRET=your_production_refresh_secret
JWT_REFRESH_EXPIRES_IN_DAYS=7
BCRYPT_HASH_RONUDS=10
STRIPE_SK=sk_live_your_production_stripe_key
STRIPE_WHSEC=whsec_your_production_webhook_secret # automatic on docker
```

#### Users Service (Production)

Create `backend/users-service/.env.production`:

```env
MONGO_URI=mongodb://mongo:27017/mydb
PORT=3000
HOST=0.0.0.0
JWT_ACCESS_SECRET=your_production_access_secret
JWT_ACCESS_EXPIRES_IN_HOURS=1
JWT_REFRESH_SECRET=your_production_refresh_secret
JWT_REFRESH_EXPIRES_IN_DAYS=7
```

#### Enterprise Service (Production)

Create `backend/enterprise-service/.env.production`:

```env
MONGO_URI=mongodb://mongo:27017/mydb
GATEWAY_PORT=3002
AUTH_PORT=3010
MERCH_PORT=3011
HOST=0.0.0.0
JWT_ACCESS_SECRET=your_production_access_secret
JWT_ACCESS_EXPIRES_IN_HOURS=600000
JWT_REFRESH_SECRET=your_production_refresh_secret
JWT_REFRESH_EXPIRES_IN_DAYS=7
BCRYPT_HASH_RONUDS=10
```

### Important Notes

- **Development vs Production**:
  - Use `127.0.0.1` for `MONGO_URI` in development (local MongoDB)
  - Use `mongo` hostname for `MONGO_URI` in production (Docker network)
  - Use `127.0.0.1` for `HOST` in development
  - Use `0.0.0.0` for `HOST` in production (to accept connections from any interface)

- **Security**:
  - Use different secrets for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
  - Generate strong, random secrets for production
  - Never commit `.env` or `.env.production` files to version control
  - Use test Stripe keys (`sk_test_`) in development and live keys (`sk_live_`) in production

## Running the Application

### Development Mode

1. Start MongoDB locally
2. Create `.env` files in each service directory
3. Install dependencies and run each service:

```bash
# Admin Service
cd backend/admin-service
pnpm install
pnpm dev

# Users Service
cd backend/users-service
pnpm install
pnpm dev

# Enterprise Service
cd backend/enterprise-service
pnpm install
pnpm dev

# Frontend
cd frontend
pnpm install
pnpm start
```

### Production Mode (Docker)

1. Create `.env.production` files in each service directory
2. Create `.env` file in `backend/docker/` directory for Docker Compose
3. Build and run with Docker Compose:

```bash
cd backend/docker
docker-compose up -d --build
```

The application will be accessible at `http://localhost` through the Nginx reverse proxy:

- `/` - Frontend
- `/api/users/` - Users Service API
- `/api/admin/` - Admin Service API
- `/api/enterprise/` - Enterprise Service API

### Stopping Docker Services

```bash
cd backend/docker
docker-compose down
```

## API Routes

All backend services are accessible through the Nginx reverse proxy with compression enabled (Brotli with Gzip fallback).
