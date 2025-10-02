FROM node:24-alpine3.21

RUN apk add --no-cache git

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
