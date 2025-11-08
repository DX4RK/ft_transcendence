#!/bin/bash

export VAULT_ADDR="http://vault:8200"
export VAULT_TOKEN="myroot"

# Wait for Vault to be ready
for i in {1..30}; do
    if vault status > /dev/null 2>&1; then break; fi
    sleep 1
done

# Create SSL directories
mkdir -p /etc/ssl/certs /etc/ssl/private

# Fetch SSL certificates from Vault
echo "Fetching SSL certificates from Vault..."

vault kv get -field=cert secret/ssl/certificates > /etc/ssl/certs/nginx.crt
vault kv get -field=key secret/ssl/certificates > /etc/ssl/private/nginx.key

# Set proper permissions
chmod 644 /etc/ssl/certs/nginx.crt
chmod 600 /etc/ssl/private/nginx.key

echo "SSL certificates deployed from Vault successfully"
