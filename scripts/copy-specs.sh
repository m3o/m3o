#!/bin/bash

set -e
set -x

DIR=$(realpath `dirname $0`)
PWD=`pwd`

git clone https://github.com/micro/services /tmp/services

cd /tmp/services

for j in *; do
  if [ ! -d $j ] || [ -f $j/skip ] || [ ! -d $j/proto ]; then
    continue
  fi

  cd $j && make api && cp api-${j}.json $DIR/../api/spec/${j}.json && cd ..
done

cd $PWD

rm -rf /tmp/services 
