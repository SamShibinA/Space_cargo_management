FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build
FROM node:18 AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
FROM node:18
WORKDIR /app
COPY --from=backend-builder /app/backend .
COPY --from=frontend-builder /app/frontend/dist ./public
EXPOSE 8000
CMD ["node", "index.js"]
