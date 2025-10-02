FROM keinos/sqlite3:latest AS sqlite3

FROM alpine:latest

COPY --from=sqlite3 /usr/bin/sqlite3 /usr/bin/sqlite3

ENV \
  USER_SQLITE=sqlite \
  GROUP_SQLITE=sqlite
RUN \
  addgroup -S $GROUP_SQLITE && \
  adduser  -S $USER_SQLITE -G $GROUP_SQLITE

COPY init.sh /
RUN chmod +x init.sh

CMD ["sh", "/init.sh"]
#CMD ["tail", "-f", "/dev/null"]
