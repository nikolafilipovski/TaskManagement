# Use Node.js to build the Vite app
FROM node:18-bullseye-slim AS build
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . ./

# Build the Vite app
RUN npm run build