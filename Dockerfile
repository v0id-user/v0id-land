FROM oven/bun:latest

WORKDIR /app

# Copy the rest of the application
COPY . .

# Install dependencies
RUN bun install

# Build the Next.js application
RUN bun run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application with bun run time "--bun" to use "Bun" utils
# not safe for production, but this is just a my personal blog.
CMD ["bun", "--bun", "run", "start"] 