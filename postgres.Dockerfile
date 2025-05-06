FROM postgres:alpine
COPY src/db.sql /docker-entrypoint-initdb.d/