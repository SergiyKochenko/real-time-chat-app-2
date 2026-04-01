# AI-generated Dockerfile for Node.js backend
FROM node:20-alpine
WORKDIR /app
RUN npm install -g npm@latest && npm cache clean --force
COPY backend/ ./
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
