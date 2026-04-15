FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --production

# Copy source code and public assets
COPY . .

# Expose the port from .env (8080)
EXPOSE 8080

# Start the application
CMD ["bun", "run", "index.mjs"]
