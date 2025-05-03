FROM postgres:latest
COPY src/db.sql /docker-entrypoint-initdb.d/
