FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY dist ./dist
COPY .env ./

EXPOSE 5501

CMD ["node", "dist/index.js"]
