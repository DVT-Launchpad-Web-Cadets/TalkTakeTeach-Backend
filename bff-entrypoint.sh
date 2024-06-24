#!/bin/sh

until nc -z -v -w30 postgres 5432
do
  echo "Waiting for database connection..."
  sleep 1
done

echo "Database is up - executing command"


bunx prisma migrate dev --name init --schema prisma/schema.prisma


exec "$@"