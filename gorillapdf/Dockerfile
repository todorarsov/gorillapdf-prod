##############################################
# 🔨 FRONTEND / BLOG BUILDER (Hexo)
##############################################
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Install git (needed for Hexo plugins)
RUN apk add --no-cache git

# Copy only blog directory first for caching
COPY blog/package*.json ./blog/

# Install blog dependencies
RUN cd blog && npm install

# Copy full project
COPY . .

# Build the blog (public folder)
RUN cd blog && \
    npx hexo clean && \
    npx hexo generate


##############################################
# 🚀 FINAL RUNTIME CONTAINER (PM2 + Backend)
##############################################
FROM node:18-alpine AS runtime

WORKDIR /app

# Install PM2 for process management
RUN npm install -g pm2

# Install OS deps (minimal)
RUN apk add --no-cache curl bash

# Copy backend package.json
COPY package*.json ./

# Install backend dependencies
RUN npm install --omit=dev --no-audit --no-fund

# Copy all project files
COPY . .

# Copy built blog output from builder
COPY --from=frontend-builder /app/blog/public ./blog/public

# Expose API port
EXPOSE 5001

# Environment variables
ENV NODE_ENV=production
ENV PORT=5001
# ENV MONGO_URI="mongodb://mongo:27017/GorillaDB"

##############################################
# 🏁 RUN APP WITH PM2 (Docker optimized)
##############################################
CMD ["pm2-runtime", "app.js"]
