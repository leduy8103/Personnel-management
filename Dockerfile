FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create directory for avatar uploads
RUN mkdir -p src/assets/avatar

# Expose port from .env
EXPOSE 3000

CMD ["npm", "start"]
