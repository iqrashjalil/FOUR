# Use a Node.js base image
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies (including devDependencies for TypeScript)
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the TypeScript code
RUN npx tsc

# Use a minimal Node.js image for production
FROM node:18-alpine as production

# Set the working directory
WORKDIR /app

# Copy only the necessary files for running the app
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]
