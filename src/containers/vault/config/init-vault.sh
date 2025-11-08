#!/bin/bash

export VAULT_ADDR="http://localhost:8200"
export VAULT_TOKEN="myroot"

for i in {1..20}; do
    if vault status > /dev/null 2>&1; then break; fi
    sleep 1
done

vault secrets enable -path=secret kv-v2 2>/dev/null || true

# secrets
vault kv put secret/app/jwt \
  key="my_jwt_secret_key_123456789"

vault 

echo "Vault ready"
