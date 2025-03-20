# Use official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json .
COPY package-lock.json  .

# Install dependencies
RUN npm install

# Copy the entire frontend directory
COPY . . 

# Expose React port
EXPOSE 3000

# Start the React app
CMD ["npm", "run", "dev"]