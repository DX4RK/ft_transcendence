#!/bin/bash

export VAULT_ADDR="http://localhost:8200"
export VAULT_TOKEN="myroot"

if [ -f "/vault/config/.env" ]; then
    # Convert Windows line endings to Unix
    sed -i 's/\r$//' /vault/config/.env
    
    set -a
    source /vault/config/.env
    set +a 
    echo "Environment variables loaded from .env file"
else
    echo "Warning: .env file not found at /vault/config/.env"
    exit 1
fi

echo "Waiting for Vault server to start..."
for i in {1..30}; do
    if vault status > /dev/null 2>&1; then 
        echo "Vault server is responding"
        break
    fi
    echo "Attempt $i/30: Waiting for Vault..."
    sleep 2
done

echo "Checking Vault initialization status..."
if ! vault status 2>/dev/null | grep -q "Initialized.*true"; then
    echo "Initializing Vault for the first time..."
    vault operator init -key-shares=1 -key-threshold=1 -format=json > /tmp/vault-keys.json
    
    UNSEAL_KEY=$(jq -r '.unseal_keys_b64[0]' /tmp/vault-keys.json)
    ROOT_TOKEN=$(jq -r '.root_token' /tmp/vault-keys.json)
    
    echo "Vault initialized!"
    echo "Unsealing Vault with generated key..."
    vault operator unseal "$UNSEAL_KEY"
    
    echo "UNSEAL_KEY=$UNSEAL_KEY" > /vault/data/vault-creds.txt
    echo "ROOT_TOKEN=$ROOT_TOKEN" >> /vault/data/vault-creds.txt
    
    export VAULT_TOKEN="$ROOT_TOKEN"
    echo "Vault unsealed and ready!"
else
    echo "Vault already initialized"
    if [ -f "/vault/data/vault-creds.txt" ]; then
        source /vault/data/vault-creds.txt
        echo "Loaded saved credentials"
        
        if vault status | grep -q "Sealed.*true"; then
            echo "Vault is sealed, unsealing..."
            vault operator unseal "$UNSEAL_KEY"
        fi
        export VAULT_TOKEN="$ROOT_TOKEN"
    else
        echo "No saved credentials found, Vault may need reinitialization"
    fi
fi

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

rm -f /tmp/nginx.key /tmp/nginx.crt /tmp/vault-init.txt

echo "Vault secrets initialized successfully with generated SSL certificates"
echo "All secrets loaded from .env file and stored in Vault"
echo "Vault is running in PRODUCTION mode!"

# Create a marker file to indicate initialization is complete
echo "$(date): Vault initialization completed" > /vault/data/vault-ready.txt
