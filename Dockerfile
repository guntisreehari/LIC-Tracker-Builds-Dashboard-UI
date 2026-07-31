# Build stage - compile the Angular app to static files
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage - nginx serving the compiled static files
FROM nginx:alpine
COPY --from=build /app/dist/dashboard-ui/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080