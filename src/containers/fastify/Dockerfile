FROM node:24-alpine3.21

RUN apk add --no-cache git openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY certs ./certs
EXPOSE 3000

CMD ["npm", "start"]
