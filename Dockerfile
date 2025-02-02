# Dockerfile for marketplace

# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Expose port 3000 for the React dev server
EXPOSE 3000

# Copy the start.sh script into the container
COPY start.sh .

# Make start.sh executable
RUN chmod +x start.sh

# Use start.sh as the container's entry point
CMD ["./start.sh"]
