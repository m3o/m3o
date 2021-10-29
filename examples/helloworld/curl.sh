#!/bin/bash

if [ -z $M3O_API_TOKEN ]; then
  echo "Missing MICRO_API_TOKEN"
  exit 1
fi

curl -H "Authorization: Bearer $M3O_API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name": "John"}' \
     https://api.m3o.com/v1/helloworld/call

echo
