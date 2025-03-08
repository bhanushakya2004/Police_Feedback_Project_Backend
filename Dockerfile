# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files to the container
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
