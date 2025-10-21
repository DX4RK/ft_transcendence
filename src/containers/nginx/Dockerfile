FROM node:24-alpine3.21 AS build

RUN npm install -g pnpm@latest
WORKDIR /app/front
COPY front/package.json front/pnpm-lock.yaml ./

RUN pnpm install
COPY front/ .
RUN pnpm run build

COPY . /app

FROM nginx:stable-alpine

COPY --from=build /app/conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/front/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
