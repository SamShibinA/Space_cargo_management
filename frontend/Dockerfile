# Use official Node.js
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run the frontend
CMD ["npm", "run", "dev","--","--host"]
