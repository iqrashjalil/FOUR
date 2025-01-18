# Use a Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the TypeScript files to JavaScript
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the built app
CMD ["node", "dist/app.js"]
