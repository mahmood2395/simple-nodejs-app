# Step 1 — Choose the base image
# Think of this as the OS + runtime your app lives in.
# We use the official Node.js image, version 18, slim variant (smaller size).
FROM node:18-slim

# Step 2 — Set the working directory inside the container
# All commands after this run from /app inside the container.
WORKDIR /app

# Step 3 — Copy package files first (before copying the rest of the code)
# We do this separately so Docker can cache the npm install step.
# If you only change your code (not package.json), Docker skips re-installing dependencies.
COPY package*.json ./

# Step 4 — Install dependencies
RUN npm install --production

# Step 5 — Copy the rest of your app code into the container
COPY . .

# Step 6 — Tell Docker your app listens on port 3000
# This doesn't actually open the port — it's just documentation.
# The actual port mapping happens in docker-compose.yml.
EXPOSE 3000

# Step 7 — The command to start the app when the container runs
CMD ["node", "src/index.js"]