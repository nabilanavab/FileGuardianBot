# Use an official Node.js runtime as the base image
FROM node:21-alpine3.17

# Create and set the working directory in the container
WORKDIR /FileGuardianBot

# Copy the rest of your project files to the container
COPY . .

# Install all node packages
RUN npm install

# Command to start your Node.js application
CMD ["node", "FileGuardian/FileGuardianBot"]
