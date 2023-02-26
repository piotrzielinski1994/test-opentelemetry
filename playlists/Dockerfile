FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY playlists.js ./

EXPOSE 3000

CMD [ "node", "playlists.js" ]
