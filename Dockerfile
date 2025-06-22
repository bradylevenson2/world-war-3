# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install Firebase CLI globally
RUN npm install -g firebase-tools

# Expose port for development (optional)
EXPOSE 3000

# Default command
CMD ["sh", "-c", "echo 'Container ready. Run: docker exec -it <container_name> firebase deploy'"]
