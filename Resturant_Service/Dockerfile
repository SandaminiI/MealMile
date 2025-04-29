FROM node:18-alpine

# Install dependencies for building bcrypt using apk (Alpine package manager)
RUN apk add --no-cache \
    build-base \
    && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./
RUN npm install

# Rebuild bcrypt from source if needed
RUN npm rebuild bcrypt --build-from-source

COPY . .

CMD ["node", "server.js"]
