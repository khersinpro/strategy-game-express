FROM node:21

# The working directory for the application in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json package-lock.json ./

# Install the application's dependencies
RUN npm install -g nodemon && npm install

# Copy the application's source code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]

