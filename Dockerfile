# TODO(wilsotobianco): This file is a WIP, this file will be able to do the 
# final build.
FROM node:15

WORKDIR /guachiman/

COPY package*.json ./

RUN npm ci --only=production
COPY . .
RUN npm run build:prod
# CMD [ "node", "server.js" ]