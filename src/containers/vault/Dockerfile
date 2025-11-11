FROM hashicorp/vault:latest

RUN apk add --no-cache openssl jq

COPY config/ /vault/config/

RUN chmod +x /vault/config/init-vault.sh
RUN chmod 666 /vault/config/.env
RUN chmod 666 /vault/config/vault.hcl
RUN chmod 666 /vault/config/init-vault.sh

EXPOSE 8200

CMD ["vault", "server", "-config=/vault/config/vault.hcl"]
