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

# Install HashiCorp Vault CLI
RUN wget -O /tmp/vault.zip https://releases.hashicorp.com/vault/1.15.2/vault_1.15.2_linux_amd64.zip && \
	unzip /tmp/vault.zip -d /usr/local/bin/ && \
	chmod +x /usr/local/bin/vault && \
	rm /tmp/vault.zip

RUN mkdir -p /etc/nginx/modsec /var/log/modsec_audit /etc/ssl/certs /etc/ssl/private && \
	chown -R www-data:www-data /var/log/modsec_audit && \
	chmod 755 /var/log/modsec_audit

# Copy SSL certificate fetcher script
COPY fetch-ssl-certs.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/fetch-ssl-certs.sh

COPY --from=build /app/conf/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/front/dist /usr/share/nginx/html

EXPOSE 80 443

# Start script that fetches SSL certs from Vault then starts nginx
CMD ["/bin/bash", "-c", "/usr/local/bin/fetch-ssl-certs.sh && nginx -g 'daemon off;'"]
