# Use Node.js LTS version
FROM node:lts

# Create app directory
# WORKDIR /app

# Install app dependencies
# COPY package*.json ./
# RUN npm install

# Add node_modules/.bin to PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Install Vite as a local dependency
# RUN npm install vite --save-dev

# Copy app code
# COPY . .

# Build app
# RUN npm run build

# Expose port 5173 for the app
EXPOSE 5173

# Start app
# CMD npm run dev
ENTRYPOINT npm install --include=dev && npm run dev