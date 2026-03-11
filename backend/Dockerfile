# AI-generated Dockerfile for Node.js backend
FROM node:20-alpine
WORKDIR /app
COPY backend/ ./
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
