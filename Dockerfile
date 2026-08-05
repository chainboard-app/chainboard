# Multi-stage Dockerfile for ChainBoard production

# Stage 1: Backend dependencies
FROM node:20-alpine AS backend-deps
WORKDIR /app/backend

# Install pnpm
RUN npm install -g pnpm@10

# Copy backend package files
COPY backend/package.json backend/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Stage 2: Backend build
FROM node:20-alpine AS backend-build
WORKDIR /app/backend

# Install pnpm
RUN npm install -g pnpm@10

# Copy backend package files
COPY backend/package.json backend/pnpm-lock.yaml ./

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy backend source
COPY backend/ ./

# Build backend
RUN pnpm run build

# Stage 3: Frontend build
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Install pnpm
RUN npm install -g pnpm@10

# Copy frontend package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN pnpm run build

# Stage 4: Production image
FROM node:20-alpine AS production
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy backend dependencies from backend-deps stage
COPY --from=backend-deps --chown=nodejs:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=backend-deps --chown=nodejs:nodejs /app/backend/package.json ./backend/

# Copy backend build from backend-build stage
COPY --from=backend-build --chown=nodejs:nodejs /app/backend/dist ./backend/dist

# Copy frontend build from frontend-build stage
COPY --from=frontend-build --chown=nodejs:nodejs /app/frontend/dist ./frontend/dist

# Switch to non-root user
USER nodejs

# Expose ports
EXPOSE 3000 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start both services using dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "cd backend && pnpm run start:prod & cd ../frontend && npx serve -s dist -l 3000"]
