FROM node:24-alpine3.21 AS build

RUN npm install -g pnpm@latest
WORKDIR /app/front
COPY front/package.json front/pnpm-lock.yaml ./

RUN pnpm install
COPY front/ .
RUN pnpm run build

COPY . /app

FROM nginx:stable


RUN apt-get update && apt-get install -y \
	libmodsecurity3 \
	modsecurity-crs \
	curl \
	wget \
	&& rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/modsec /var/log/modsec_audit /etc/ssl/certs /etc/ssl/private && \
	chown -R www-data:www-data /var/log/modsec_audit && \
	chmod 755 /var/log/modsec_audit

COPY certs/nginx.crt /etc/ssl/certs/
COPY certs/nginx.key /etc/ssl/private/

COPY --from=build /app/conf/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/front/dist /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
