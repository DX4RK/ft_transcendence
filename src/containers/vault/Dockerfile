FROM hashicorp/vault:latest

RUN apk add --no-cache openssl jq bash

RUN mkdir -p /vault/data && chown vault:vault /vault/data && chmod 755 /vault/data

COPY config/ /vault/config/

RUN chmod +x /vault/config/init-vault.sh
RUN chmod 666 /vault/config/.env
RUN chmod 666 /vault/config/vault.hcl
RUN chmod 666 /vault/config/init-vault.sh

RUN echo '#!/bin/bash' > /start.sh && \
    echo 'vault server -config=/vault/config/vault.hcl &' >> /start.sh && \
    echo 'sleep 5' >> /start.sh && \
    echo '/vault/config/init-vault.sh' >> /start.sh && \
    echo 'wait' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 8200

CMD ["/start.sh"]
