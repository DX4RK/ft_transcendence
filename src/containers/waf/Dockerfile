FROM nginx:stable

RUN apt-get update && apt-get install -y \
    libmodsecurity3 \
    modsecurity-crs \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/modsec /var/log/modsec_audit && \
    chown -R www-data:www-data /var/log/modsec_audit && \
    chmod 755 /var/log/modsec_audit

COPY conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
