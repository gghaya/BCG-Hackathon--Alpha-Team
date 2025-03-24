# Use official Node.js image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy only dependency files first to leverage caching
COPY package.json .
COPY package-lock.json .
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies
RUN npm install --silent

# Copy the rest of the app
COPY . .

# Expose React port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]

# Use official Node.js image
# FROM node:16-alpine

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json first
# COPY package.json .
# # COPY package-lock.json  .
# RUN chown -R root:root /app
# # Install dependencies
# # RUN  npm outdated 
# RUN npm update
# RUN  npm install
# RUN npm install react-scripts
# RUN chmod +x /app/node_modules/

# # Copy the entire frontend directory
# COPY . . 
# RUN ls /app/node_modules/
# # Expose React port
# EXPOSE 3000

# # Start the React app
# CMD ["npm","start"]