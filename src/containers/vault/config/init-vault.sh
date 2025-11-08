#!/bin/bash

export VAULT_ADDR="http://localhost:8200"
export VAULT_TOKEN="myroot"

for i in {1..20}; do
    if vault status > /dev/null 2>&1; then break; fi
    sleep 1
done

vault secrets enable -path=secret kv-v2 2>/dev/null || true

vault kv put secret/app/server \
  port="3000"

vault kv put secret/app/jwt \
  secret="c4d33a89a49710c12fce5a7d272f470a82ddd04b7680f46529514fce5ad41905"

vault kv put secret/app/gmail \
  user="fttranscendence03@gmail.com" \
  pass="rqws vbkc xjyl mcoe"

vault kv put secret/app/vonage \
  key="32d4e479" \
  secret="4RTgGmv1fo3wIlws"

vault kv put secret/app/cookie \
  secret="JhMAZm3stJcqo9Y9bEfVlfKY4pp7wxSBbTIg0L/nXJl5QQoitAaMaF8jRBVOMeCM41Om3JyShUsLJKirMukelA=="

vault kv put secret/app/database \
  host="db" \
  user="transcendence_user" \
  password="secure_db_password_123" \
  database="transcendence"

echo "Vault secrets initialized successfully"
