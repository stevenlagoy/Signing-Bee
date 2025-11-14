# --- Stage 1: build frontend ---
FROM node:22-bookworm AS build-frontend

# Sets the working directory name inside of the docker image
WORKDIR /app

# Copy only the frontend package.json before running npm ci
COPY frontend/package*.json ./frontend/
# The reason we don't copy all is that npm ci won't install all the packages every build from code changes due to how its caching works.
RUN cd frontend && npm ci
# Now we copy the rest of the frontend source code and even if this code is different npm ci won't run again
COPY frontend ./frontend
# Build the files for distribution
RUN cd frontend && npm run build


# --- Stage 2: runtime image with backend + built frontend ---
FROM node:22-slim AS runtime

WORKDIR /app

# Copy only the backend package.json before running npm ci
COPY backend/package*.json ./backend/
# The reason we don't copy all is that npm ci won't install all the packages every build from code changes due to how its caching works.
RUN cd backend && npm ci --omit=dev
# Now we copy the rest of the backend source code and even if this code is different npm ci won't run again
COPY backend ./backend
# Copy built frontend into this leaner runtime image so we can discard the tool heavy image ussed for building
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

# Cloud Run entrypoint
CMD ["node", "index.js"]
