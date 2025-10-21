FROM node:24-alpine3.21 AS build

RUN npm install -g pnpm@latest
WORKDIR /app/react
COPY react/package.json react/pnpm-lock.yaml ./

RUN pnpm install
COPY react/ .
RUN pnpm run build

COPY . /app

FROM nginx:stable-alpine

COPY --from=build /app/conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/react/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
