# FROM node:20-alpine as build-image
# WORKDIR /usr/src/app
# COPY package*.json tsconfig*.json index.html vite.config.ts public ./
# COPY src/* src/
# RUN npm i
# RUN npm run build

FROM pierrezemb/gostatic
COPY ./dist /srv/http/