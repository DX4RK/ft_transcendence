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

# SSL Certificates
vault kv put secret/ssl/certificates \
  cert="-----BEGIN CERTIFICATE-----
MIIDhTCCAm2gAwIBAgIUMcVgwDUocEoFvitDqPDA8zpi56kwDQYJKoZIhvcNAQEL
BQAwUjELMAkGA1UEBhMCRlIxDTALBgNVBAgMBE5pY2UxDTALBgNVBAcMBE5pY2Ux
ETAPBgNVBAoMCDQyU2Nob29sMRIwEAYDVQQDDAlsb2NhbGhvc3QwHhcNMjUxMDI3
MjI1MDE2WhcNMjYxMDI3MjI1MDE2WjBSMQswCQYDVQQGEwJGUjENMAsGA1UECAwE
TmljZTENMAsGA1UEBwwETmljZTERMA8GA1UECgwINDJTY2hvb2wxEjAQBgNVBAMM
CWxvY2FsaG9zdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANphn0i6
mW9RnZwleU0qjGHwBaUIL/vuoyX8htlRFnEsiuilumuwdIeBzMIB0RqPAyeyN1xp
82lvEu8X2NFwkWojZ8DinL98J//JzKLWeC4jV2fG9IRoF8oDuzqzmnEj8JHt67pm
16mqg335y6CVj7KILLfUI2oOfa92UIpXIQ5dAKxikbEP+67jfhvo5lz25e9i/pjq
ih4Ef/d3Q+ti3CniieJTj8fYVQuWZ9YaXbN5DSO5HrV8m/jSns9YRaRXPUVvnS1r
z8LNgQu3Dm9CM69nQMhneEDjSQyU0VCSPf4aNZ9mwV97zdlDUPjXIzOsxn+5ugoB
xEsUpHH+mEAWyCECAwEAAaNTMFEwHQYDVR0OBBYEFJg5/cR9t9JDtqR12uN7dxsV
Zso5MB8GA1UdIwQYMBaAFJg5/cR9t9JDtqR12uN7dxsVZso5MA8GA1UdEwEB/wQF
MAMBAf8wDQYJKoZIhvcNAQELBQADggEBABiHmXZeAG++vdYvFJYdw5R8MTg4ctak
RRBVIQLVN8HIKeb4nW5AODbWDaSu0SjbgiUGkhtccWdmVEvHmSSNIoAqxs85wGct
F7WgDYQd8w04quZbVxCSfgzvWWWZ7ZAXvXiETRi1BEB31ID2YtfSq9Iv5ISgwvQy
TdMdZjcEy5VLP5gV6ODqti/EdmtBX2yJs/16+amdHNP2+FzeWTfGqBLec6M51HH+
2YHNkivbXni2bOUjJycutJfShIPI6ZnKT4OvImf5NyiZU939zDUanLMaqMOmmqkE
st+5NTgvZTTwwCUZh6tlx5gxmm9zPiN7SU2OPqqc8cvz90YWVqoutkk=
-----END CERTIFICATE-----" \
  key="-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDaYZ9IuplvUZ2c
JXlNKoxh8AWlCC/77qMl/IbZURZxLIropbprsHSHgczCAdEajwMnsjdcafNpbxLv
F9jRcJFqI2fA4py/fCf/ycyi1nguI1dnxvSEaBfKA7s6s5pxI/CR7eu6ZtepqoN9
+cuglY+yiCy31CNqDn2vdlCKVyEOXQCsYpGxD/uu434b6OZc9uXvYv6Y6ooeBH/3
d0PrYtwp4oniU4/H2FULlmfWGl2zeQ0juR61fJv40p7PWEWkVz1Fb50ta8/CzYEL
tw5vQjOvZ0DIZ3hA40kMlNFQkj3+GjWfZsFfe83ZQ1D41yMzrMZ/uboKAcRLFKRx
/phAFsghAgMBAAECggEAOyEtsNKdku+lXk8jPgqkQixsStghrfRahoGOva7gBbrK
zd150YjQtJQnrewyAx/v+cKejM4/Uy/5D3YEhgkVxohZond5e7uRVQf9+aVamxuE
ohvTvzo0HsXN30IcMkBJ9ilWp30LLex2eBi30v5MD0oh2ZB+GkxcKbM+cYbP84Qp
CnCcrNPg1s74hSWR89AmEAf3nDRfy82jAZSpp4LwP6s6Fiq8TZR/nsio5czhNftk
XWfV/n1sGEA8baWtD+/aEZvYSzboqMeYoQgwVqSiMRsOpB0f1vLQH64M/7uRJpFx
pp/vEIC0bEUzUhCq25cr45IQgLyvLqYvaxEXyqd4VQKBgQDvNlvxG3oG10FwBBT9
m0rg3mW/0PFV2bKMvnVgWTVymE4OdcqH/XBJI4rJpsan5Kv6dJ2v1huNehC/f75q
hv9PM171v7xWr+uVWyyL9CFocCipJSV+ReBXDHTJkXHeFYuC5S7RbzdXQhuPWvJy
0aNA3YPsIgYWPkvWQRSvpINxQwKBgQDptQR2LZ6lYpe/7ZXb5ZtuVayBNpFnn31v
QmsVleQSLZFl+vi+RKVXnPcfT4t4BUvKjc7Dro2y0Z5x+TLW+tJltCYuDn7t4/L3
jbt33Yv4tYKaXKSVPQ+9nEL9lDauCnruOMKcNvYKlDBYllkvVVOyWGs15V6Ehn8O
QYaZE9ioywKBgFoOrASUpJcouPEUCFcF/OW1tLbHUeRRRiAooAX6791Jq7FT9UDH
UFuortqGGCojM//hoXAOemcD+oQt8qEmW74Uh/6bBavZJScgoR+7dExeVWCApKHq
arA690jfoe/LSq+n2r1sUnheYgPRaI+DjyOfgcgHcyUypNhvvfr2Q6oDAoGBANNI
rKTur1uTm9+POolXtkJ0wAT9QU1uWido44jbPxrUCXwp/hF93AEuThgHgO5b015m
/8PXHhHJArbFdRn4HpiF2nKO9l+5UiJOB2rhZzbNWiqVkNG/J2jjSYkZIqoLnYGa
3Q3/fkaoHGEqY6ywNn+pAhvyppWnRlysDrR7xccrAoGBANiKDzRogEX4x1NASHv2
yhMTlOkQg6iPGlxwobfWsL/Gr8Xqi+suuGqvp7tgSwFOfOPLCEA+71any1ocHpgM
cgNbh5v2AqVEV8jJ2dFRYbNIhs2BG/yaX5xQ+8bMLAtTsBow0oBRSIB0zASjaEzg
5xQGrw+BED7agCkUwcHw8v+5
-----END PRIVATE KEY-----"

echo "Vault secrets initialized successfully"
