FROM node:20-alpine

# Install Docker CLI + build tools + TypeScript
RUN apk add --no-cache docker-cli python3 make g++ \
  && npm install -g typescript

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --production

# Copy source code
COPY . .

RUN npm run build


EXPOSE 5501

CMD ["node", "dist/index.js"]
