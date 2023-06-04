# M3O Cloud

Infrastructure automation for the M3O platform.

## Overview

This directory serves as infrastructure automation for the M3O platform. It bootstraps [Micro](https://micro.dev) on to any cloud using Pulumi, 
Kubernetes and related open source distributed systems infrastructure. The defaults are set to run on DigitalOcean with potential for 
Google Cloud and other providers also built in.

## Usage

## Generate the CA for the clusters cert issuer

```
openssl genrsa -out ca.key 4096
openssl req -x509 -new -nodes -key ca.key -subj "/CN=m3o" -days 3650 -reqexts v3_req -extensions v3_ca -out ca.crt -config /usr/local/etc/
cat ca.key | pulumi config set m3o:ca-key --secret
cat ca.crt | pulumi config set m3o:ca-crt --secret
rm ca.key ca.crt
```

## Create the google oauth secrets

TODO: Document these steps

```
pulumi config set google_oauth_client_id [value] --secret
pulumi config set google_oauth_secret_id [value] --secret
```

## Start the cluster

```
pulumi up
```

## Start a minimal cluster for testing/development
To start up a cluster without the monitoring etc we have stripped down file (`index.minimal.ts`) with just the important stuff rather than the default `index.ts`. We should also dial down the size of the nodes to something cheap like `s-2vcpu-4gb`. 

```
cp index.minimal.ts index.ts
pulumi config set digitalocean:node_slug "s-2vcpu-4gb"
pulumi up
```

## Update the DNS records

```
Download the kubeconfig and then set the API and Proxy DNS records to the values from: `kubectl get ingress`.
```

Set the wildcard DNS record to the IP from Tailscale. TODO: Document this step more.

### Login using default credentials

```
micro login --username=admin --password=micro
```

# Set the required config

```
micro config set micro.alert.slack.token [slack api key]
micro config set micro.alert.slack.enabled true
micro config set micro.payments.stripe.api_key [stripe api key]
micro config set micro.emails.sendgrid.api_key [sendgrid api key]
micro config set micro.emails.email_from "Micro Team <support@m3o.com>";
micro config set micro.emails.enabled true;
micro config set micro.signup.no_payment true;
micro config set micro.signup.sendgrid.template_id d-240bf196257143569539b3b6b82127c0;
micro config set micro.signup.sendgrid.recovery_template_id d-08c2330ae2824de5b2730e49e298e97e;
micro config set micro.invite.sendgrid.invite_template_id d-2d107482af6d47f8a721315906ada753;
micro config set micro.signup.email_from "Micro Team <support@m3o.com>";
micro config set micro.status.services "api,auth,broker,config,network,proxy,registry,runtime,status,store,signup,platform,invite,customers,namespaces,emails,alert,billing";
micro config set micro.platform.resource_limits.cpu 1000
micro config set micro.platform.resource_limits.memory 1000
micro config set micro.platform.resource_requests.cpu 1000
micro config set micro.platform.resource_requests.memory 1000
# TODO: specify the additional config
```

## Run the m3o services

```
micro run github.com/m3o/m3o/api/alert
micro run github.com/m3o/m3o/api/balance
micro run github.com/m3o/m3o/api/customers
micro run github.com/m3o/m3o/api/emails
micro run github.com/m3o/m3o/api/endtoend
micro run github.com/m3o/m3o/api/internal
micro run github.com/m3o/m3o/api/mailchimp
micro run github.com/m3o/m3o/api/mixpanel
micro run github.com/m3o/m3o/api/oauth
micro run github.com/m3o/m3o/api/onboarding
micro run github.com/m3o/m3o/api/pkg
micro run github.com/m3o/m3o/api/publicapi
micro run github.com/m3o/m3o/api/status
micro run github.com/m3o/m3o/api/stripe
micro run github.com/m3o/m3o/api/usage
micro run github.com/m3o/m3o/api/v1
micro run github.com/m3o/m3o/api/admin
micro run github.com/m3o/m3o/api/billing
micro run github.com/m3o/m3o/api/projects
```
