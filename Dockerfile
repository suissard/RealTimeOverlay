# Stage 1: Build the frontend
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Vue.js application
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the server code
COPY --from=builder /app/server ./server

# Copy the built frontend assets from the builder stage
COPY --from=builder /app/public ./public

# Expose the port the server listens on
EXPOSE 3000

# Set a non-root user for security
USER node

# Command to run the application
CMD ["npm", "run", "start"]
