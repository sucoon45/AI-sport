FROM node:18-slim

# Install dependencies for Playwright
RUN apt-get update && apt-get install -y \
    libgbm-dev \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .
RUN npm install

# Install Playwright browsers (Railway has enough storage for this)
RUN npx playwright install chromium

COPY . .

CMD ["npm", "start"]
