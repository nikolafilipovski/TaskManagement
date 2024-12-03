# Use Node.js to build the app
FROM node:18-bullseye-slim AS build
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy the source code and build the app
COPY . ./
RUN npm run dev

# Use Nginx for serving the app
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]