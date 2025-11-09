FROM hashicorp/vault:latest

RUN apk add --no-cache openssl

COPY config/ /vault/config/

RUN chmod +x /vault/config/init-vault.sh

EXPOSE 8200

CMD ["vault", "server", "-dev", "-dev-listen-address=0.0.0.0:8200"]
