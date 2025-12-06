## Environment Configuration

This project uses two different environment files for different purposes:

### `.env` - Development Environment
- Used when running the application locally during development
- Run with: `pnpm dev` or `pnpm start`
- Not included in Docker builds (ignored by `.dockerignore`)
- Contains development database connections and local settings

### `.env.production` - Production/Docker Environment
- Used by Docker containers in production deployments
- Automatically copied as `.env` during Docker compose build process
- Contains production database connections and secure configurations
- **Required for Docker builds**

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create `.env` file with development settings:
   ```bash
   cp .env.example .env
   ```

3. Generate Prisma client:
   ```bash
   pnpm prisma generate
   ```

4. Run development server:
   ```bash
   pnpm dev
   ```

### Docker Production Build

1. Create `.env.production` file with production settings

2. Build Docker image:
   ```bash
   docker build -t admin-service:latest .
   ```

3. Run with Docker Compose:
   ```bash
   docker-compose up
   ```

## API Documentation

Once running, access Swagger documentation at:
- Development: `http://localhost:3000/documentation`
- Production: `http://localhost:3001/documentation` (via Docker)

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server (requires build)
- `pnpm prisma generate` - Generate Prisma client
