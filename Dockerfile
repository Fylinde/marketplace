# Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
 RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app for production
#RUN npm run build

# Use nginx to serve the app
#FROM nginx:alpine
#COPY --from=0 /app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Start the app
CMD ["npm", "start"]
