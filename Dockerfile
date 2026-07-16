# Multi-stage Dockerfile for ChainBoard development

# Stage 1: Backend
FROM node:18-alpine AS backend
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci

# Copy backend source
COPY backend/ ./

# Build backend
RUN npm run build

# Stage 2: Frontend
FROM node:18-alpine AS frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS production
WORKDIR /app

# Copy backend build and dependencies
COPY --from=backend /app/backend/dist ./backend/dist
COPY --from=backend /app/backend/node_modules ./backend/node_modules
COPY --from=backend /app/backend/package.json ./backend/

# Copy frontend build
COPY --from=frontend /app/frontend/dist ./frontend/dist

# Expose ports
EXPOSE 3000 4000

# Start both services
CMD ["sh", "-c", "cd backend && npm run start:prod & cd ../frontend && npx serve -s dist -l 3000"]
