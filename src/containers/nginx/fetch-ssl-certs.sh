#!/bin/bash

export VAULT_ADDR="http://vault:8200"

echo "Waiting for Vault to be ready..."

for i in {1..60}; do
    echo "Attempt $i: Testing Vault connection..."
    if vault status > /dev/null 2>&1; then 
        echo "✅ Vault is ready!"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "❌ Vault not accessible after 60 attempts"
        echo "Network test - ping vault:"
        ping -c 3 vault || echo "Cannot ping vault container"
        echo "DNS test - nslookup vault:"
        nslookup vault || echo "Cannot resolve vault hostname"
        exit 1
    fi
    sleep 1
done

# Try to get the real token from Vault data
echo "Looking for Vault credentials..."
for attempt in {1..60}; do
    if [ -f "/vault/data/vault-creds.txt" ] && [ -f "/vault/data/vault-ready.txt" ]; then
        source /vault/data/vault-creds.txt
        export VAULT_TOKEN="$ROOT_TOKEN"
        echo "✅ Using production token from credentials file"
        echo "✅ Vault initialization confirmed complete"
        break
    else
        echo "⚠️ Attempt $attempt: Waiting for Vault initialization to complete..."
        sleep 2
    fi
done

if [ ! -f "/vault/data/vault-creds.txt" ] || [ ! -f "/vault/data/vault-ready.txt" ]; then
    echo "❌ Vault not ready after 60 attempts (120 seconds)"
    exit 1
fi

mkdir -p /etc/ssl/certs /etc/ssl/private

echo "Fetching SSL certificates from Vault..."

if vault kv get -field=cert secret/ssl/certificates > /etc/ssl/certs/nginx.crt; then
    echo "✅ Certificate fetched successfully"
else
    echo "❌ Failed to fetch certificate"
    exit 1
fi

if vault kv get -field=key secret/ssl/certificates > /etc/ssl/private/nginx.key; then
    echo "✅ Private key fetched successfully"
else
    echo "❌ Failed to fetch private key"
    exit 1
fi

if [ ! -s /etc/ssl/certs/nginx.crt ]; then
    echo "❌ Certificate file is empty"
    exit 1
fi

if [ ! -s /etc/ssl/private/nginx.key ]; then
    echo "❌ Private key file is empty"
    exit 1
fi

chmod 644 /etc/ssl/certs/nginx.crt
chmod 600 /etc/ssl/private/nginx.key

echo "✅ SSL certificates deployed from Vault successfully"
