# M3O Platform

A platform build of [Micro](https://github.com/micro/micro)

## Overview

This build of Micro includes the platform profile. It's leveraging highly available and 
distributed infrastructure in a cloud based environment. The platform image is hosted 
at `ghcr.io/micro/platform`. It makes use of kubernetes, redis, etcd, postgres and more.

## Dependencies

- Etcd
- Redis
- Postgres
- S3

## Usage

See the profile for how to configure dependencies via env vars

Build this binary or use the `ghcr.io/m3o/platform` image.
