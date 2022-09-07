# Micro Platform

A build of the [Micro](https://github.com/micro/micro) platform including our v1 plugin

## Overview

This build of the micro platform includes the v1 plugin which short circuits the request flow to 
bypass proxying and directly pass through requests from the micro api to the v1 api. Removing 
the extra network hop plus internal routing should speedup requests.
