FROM node:20-slim as builder
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json* .
RUN npm ci --legacy-peer-deps

FROM node:20-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ /usr/src/app/

# Copy server files and content
COPY server/ ./server/
COPY content/ ./content/
COPY start.sh ./

# Make start script executable
RUN chmod +x start.sh

# Create lancedb directory for vector store
RUN mkdir -p /usr/src/app/lancedb

EXPOSE 3001

# Run the chat server (generates embeddings for new content, then starts API)
CMD ["./start.sh"]
