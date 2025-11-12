FROM hashicorp/vault:latest

RUN apk add --no-cache openssl jq bash curl

RUN mkdir -p /vault/data && chown vault:vault /vault/data && chmod 755 /vault/data

COPY config/ /vault/config/

RUN chmod +x /vault/config/init-vault.sh
RUN chmod 666 /vault/config/.env
RUN chmod 666 /vault/config/vault.hcl
RUN chmod 666 /vault/config/init-vault.sh

EXPOSE 8200

CMD ["vault", "server", "-dev", "-dev-listen-address=0.0.0.0:8200"]
