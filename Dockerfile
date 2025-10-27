FROM node:20

# Install git and timezone data
RUN apt-get update && apt-get install -y git tzdata && rm -rf /var/lib/apt/lists/*
ENV TZ=Europe/London

WORKDIR /app

# Clone the repository
RUN git clone https://github.com/Capzay/IVI-EVA-01.git .

# Copy environment file from host (mount this when running the container)
# The .env file should be provided at runtime via volume mount or build arg
COPY .env /app/.env

# Install dependencies
RUN npm install

# Build the TypeScript code
RUN npm run build

# Create necessary directories
RUN mkdir -p src/data/availability

CMD ["node", "--enable-source-maps", "dist/index.js"]