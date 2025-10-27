FROM node:20

RUN apt-get update && apt-get install -y tzdata && rm -rf /var/lib/apt/lists/*
ENV TZ=Europe/London

WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build
RUN mkdir src/data/availability

CMD ["node", "--enable-source-maps", "dist/index.js"]