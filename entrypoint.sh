#!/bin/sh
echo "Injecting environment variables into env.json..."

envsubst < /usr/share/nginx/html/env.template.json > /usr/share/nginx/html/env.json

exec "$@"