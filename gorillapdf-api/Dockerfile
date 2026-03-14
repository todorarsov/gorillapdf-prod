# ===== BACKEND DOCKERFILE =====
FROM node:20.17.0-bullseye AS backend-builder

# Set working directory
WORKDIR /usr/src/app

# Install system dependencies including LibreOffice, Ghostscript, Tesseract
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    make \
    g++ \
    build-essential \
    ghostscript \
    libgs-dev \
    qpdf \
    poppler-utils \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    libreoffice-common \
    fonts-dejavu-core \
    fonts-liberation \
    unzip \
    curl \
    tesseract-ocr \
    tesseract-ocr-eng \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Set Python path for node-gyp
ENV PYTHON=/usr/bin/python3

# Upgrade npm and install PM2 globally
RUN npm install -g npm@11.6.4 pm2

# Install Python library for PDF to DOCX conversion
RUN pip3 install --no-cache-dir pdf2docx

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install Node dependencies
RUN npm ci

# Copy backend source code
COPY ./ ./

# Copy PM2 process file
COPY processes.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7001

# Expose backend port
EXPOSE 7001

# Start backend and cleanup via PM2 in foreground (Docker-friendly)
CMD ["pm2-runtime", "processes.json"]
