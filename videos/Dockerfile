FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY videos.js ./

EXPOSE 3000

CMD [ "node", "videos.js" ]
