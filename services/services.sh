#!/bin/bash

# This script builds a top level client for services

SERVICES=`find . -maxdepth 2 -type d -name proto | cut -f 2 -d / | sort`

cat << EOF
package services

import (
	"github.com/micro/micro/v3/service/client"
EOF

for service in ${SERVICES[@]}; do
	echo -e "\t\"github.com/m3o/m3o/services/${service}/proto\""
done

cat << EOF
)
EOF

cat << EOF

type Client struct { 
EOF

for service in ${SERVICES[@]}; do
	echo -e "\t${service^} ${service}.${service^}Service"
done

cat << EOF
}

EOF

cat << EOF
func NewClient(c client.Client) *Client {
	return &Client{
EOF

for service in ${SERVICES[@]}; do
	echo -e "\t\t${service^}: ${service}.New${service^}Service(\"${service}\", c),"
done

cat << EOF
	}
}
EOF
