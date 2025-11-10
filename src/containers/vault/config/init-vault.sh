#!/bin/bash

export VAULT_ADDR="http://localhost:8200"
export VAULT_TOKEN="myroot"

if [ -f "/vault/config/.env" ]; then
    export $(grep -v '^#' /vault/config/.env | xargs)
    echo "Environment variables loaded from .env file"
else
    echo "Warning: .env file not found at /vault/config/.env"
    exit 1
fi

for i in {1..20}; do
    if vault status > /dev/null 2>&1; then break; fi
    sleep 1
done

vault secrets enable -path=secret kv-v2 2>/dev/null || true

echo "Generating SSL certificate..."
openssl req -x509 -newkey rsa:4096 -keyout /tmp/nginx.key -out /tmp/nginx.crt -days 365 -nodes \
    -subj "/C=FR/ST=Nice/L=Nice/O=42School/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"

CERT_CONTENT=$(cat /tmp/nginx.crt)
KEY_CONTENT=$(cat /tmp/nginx.key)

vault kv put secret/app/server \
  port="$PORT"

vault kv put secret/app/jwt \
  secret="$JWT_SECRET"

vault kv put secret/app/gmail \
  user="$GMAIL_USER" \
  pass="$GMAIL_PASS"

vault kv put secret/app/vonage \
  key="$VONAGE_KEY" \
  secret="$VONAGE_SECRET"

vault kv put secret/app/cookie \
  secret="$COOKIE_SECRET"

vault kv put secret/app/database \
  host="$DB_HOST" \
  user="$DB_USER" \
  password="$DB_PASSWORD" \
  database="$DB_NAME"

vault kv put secret/ssl/certificates \
  cert="$CERT_CONTENT" \
  key="$KEY_CONTENT"

rm -f /tmp/nginx.key /tmp/nginx.crt

echo "Vault secrets initialized successfully with generated SSL certificates"
echo "All secrets loaded from .env file and stored in Vault"
