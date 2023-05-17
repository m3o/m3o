import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as ocean from "@pulumi/digitalocean";
import * as etcd from "../etcd";
import * as postgres from "../postgres";
import * as crd from "../crd";
import * as redis from "../redis"
import { project, provider } from "../cluster";
import { ObjectMeta } from "../crd/meta/v1";
import { Output } from "@pulumi/pulumi";

const image = "ghcr.io/m3o/platform:20230517123459ec0d57";
const imagePullPolicy = "Always";
const replicas = 2;

export const microNamespace = new k8s.core.v1.Namespace(
  "micro-namespace",
  {
    metadata: {
      name: "micro",
      labels: {
        owner: "micro"
      }
    }
  },
  { provider }
);

export const serverNamespace = new k8s.core.v1.Namespace(
  "server-namespace",
  {
    metadata: {
      name: "server",
      labels: {
        owner: "micro"
      }
    }
  },
  { provider }
);

export const jwtCert = new crd.certmanager.v1.Certificate(
  "jwt-creds",
  {
    metadata: {
      name: "jwt-creds",
      namespace: "server"
    },
    spec: {
      duration: "87600h", // 10 years
      secretName: "jwt-creds",
      subject: {
        organizations: ["m3o"]
      },
      isCA: false,
      commonName: "auth",
      privateKey: {
        algorithm: "RSA",
        size: 4096
      },
      issuerRef: {
        name: "ca",
        kind: "ClusterIssuer"
      }
    }
  },
  { provider }
);

export const storeBucket = new ocean.SpacesBucket(
  "micro-store-bucket",
  {
    region: "ams3"
  },
  {
    parent: project
  }
);

export const runtimeBucket = new ocean.SpacesBucket(
  "micro-runtime-bucket",
  {
    region: "ams3"
  },
  {
    parent: project
  }
);

export const eventsBucket = new ocean.SpacesBucket(
  "micro-events-bucket",
  {
    region: "ams3"
  },
  {
    parent: project
  }
);

export const runtimeServiceAccount = new k8s.core.v1.ServiceAccount(
  "micro-runtime-sa",
  {
    metadata: {
      namespace: "server"
    }
  },
  { provider }
);

export const runtimeRole = new k8s.rbac.v1.ClusterRole(
  "runtime-role",
  {
    metadata: {
      name: "micro-runtime"
    },
    rules: [
      {
        apiGroups: [""],
        resources: [
          "pods",
          "pods/log",
          "services",
          "secrets",
          "namespaces",
          "resourcequotas"
        ],
        verbs: [
          "get",
          "create",
          "update",
          "delete",
          "deletecollection",
          "list",
          "patch",
          "watch"
        ]
      },
      {
        apiGroups: ["apps"],
        resources: ["deployments"],
        verbs: ["create", "update", "delete", "list", "patch", "watch"]
      },
      {
        apiGroups: [""],
        resources: ["secrets", "pods", "pods/logs"],
        verbs: ["get", "watch", "list"]
      },
      {
        apiGroups: ["networking.k8s.io"],
        resources: ["networkpolicy", "networkpolicies"],
        verbs: [
          "get",
          "create",
          "update",
          "delete",
          "deletecollection",
          "list",
          "patch",
          "watch"
        ]
      }
    ]
  },
  { provider }
);

export const runtimeClusterRoleBinding = new k8s.rbac.v1.ClusterRoleBinding(
  "micro-runtime-crb",
  {
    subjects: [
      {
        kind: "ServiceAccount",
        name: runtimeServiceAccount.metadata.name,
        namespace: "server"
      }
    ],
    roleRef: {
      kind: "ClusterRole",
      name: runtimeRole.metadata.name,
      apiGroup: "rbac.authorization.k8s.io"
    }
  },
  { provider }
);

export const runtimeRoleBinding = new k8s.rbac.v1.RoleBinding(
  "runtime-role-binding",
  {
    metadata: {
      name: "micro-runtime",
      namespace: "server"
    },
    roleRef: {
      apiGroup: "rbac.authorization.k8s.io",
      kind: "ClusterRole",
      name: runtimeRole.metadata.name
    },
    subjects: [
      {
        kind: "ServiceAccount",
        name: runtimeServiceAccount.metadata.name
      }
    ]
  },
  { provider }
);

const conf = new pulumi.Config("digitalocean");
export const spacesSecret = new k8s.core.v1.Secret(
  "spaces-secret",
  {
    metadata: {
      name: "do-spaces",
      namespace: "server"
    },
    stringData: {
      accessId: conf.require("spacesAccessId"),
      secretKey: conf.require("spacesSecretKey")
    }
  },
  { provider }
);

function microDeployment(srv: string, port: number): k8s.apps.v1.Deployment {
  let env: pulumi.Input<pulumi.Input<k8s.types.input.core.v1.EnvVar>[]> = [
    {
      name: "MICRO_SERVICE_NAME",
      value: srv
    },
    {
      name: "MICRO_PROFILE",
      value: "platform"
    },
    {
      name: "MICRO_AUTH_PUBLIC_KEY",
      valueFrom: {
        secretKeyRef: {
          name: (jwtCert.metadata as ObjectMeta).name,
          key: "tls.crt"
        }
      }
    },
    {
      name: "MICRO_AUTH_PRIVATE_KEY",
      valueFrom: {
        secretKeyRef: {
          name: (jwtCert.metadata as ObjectMeta).name,
          key: "tls.key"
        }
      }
    },
    {
      name: "MICRO_SERVICE_ADDRESS",
      value: `:${port}`
    },
    {
      name: "MICRO_BROKER_ADDRESS",
      value: redis.redis.uri
    },
    {
      name: "MICRO_REGISTRY_TLS_CA",
      value: "/certs/registry/ca.crt"
    },
    {
      name: "MICRO_REGISTRY_TLS_CERT",
      value: "/certs/registry/tls.crt"
    },
    {
      name: "MICRO_REGISTRY_TLS_KEY",
      value: "/certs/registry/tls.key"
    },
    {
      name: "MICRO_REGISTRY_ADDRESS",
      value: "etcd.etcd:2379"
    },
    {
      name: "MICRO_STORE_ADDRESS",
      value: postgres.postgres.uri
    },
    {
      name: "MICRO_TRACING_REPORTER_ADDRESS",
      value: "jaeger-agent.server:6831"
    }
  ];

  if (srv === "runtime" || srv === "store") {
    env.push(
      {
        name: "MICRO_BLOB_STORE_REGION",
        value: "ams3"
      },
      {
        name: "MICRO_BLOB_STORE_ENDPOINT",
        value: "ams3.digitaloceanspaces.com"
      },
      {
        name: "MICRO_BLOB_STORE_BUCKET",
        value: srv === "runtime" ? runtimeBucket.name : storeBucket.name
      },
      {
        name: "MICRO_BLOB_STORE_ACCESS_KEY",
        valueFrom: {
          secretKeyRef: {
            name: spacesSecret.metadata.name,
            key: "accessId"
          }
        }
      },
      {
        name: "MICRO_BLOB_STORE_SECRET_KEY",
        valueFrom: {
          secretKeyRef: {
            name: spacesSecret.metadata.name,
            key: "secretKey"
          }
        }
      }
    );
  }

  if (srv === "events") {
    env.push(
      {
        name: "MICRO_EVENTS_STORE_REGION",
        value: "ams3"
      },
      {
        name: "MICRO_EVENTS_STORE_ENDPOINT",
        value: "ams3.digitaloceanspaces.com"
      },
      {
        name: "MICRO_EVENTS_STORE_BUCKET",
        value: eventsBucket.name
      },
      {
        name: "MICRO_EVENTS_STORE_ACCESS_KEY",
        valueFrom: {
          secretKeyRef: {
            name: spacesSecret.metadata.name,
            key: "accessId"
          }
        }
      },
      {
        name: "MICRO_EVENTS_STORE_SECRET_KEY",
        valueFrom: {
          secretKeyRef: {
            name: spacesSecret.metadata.name,
            key: "secretKey"
          }
        }
      }
    );
  }

  if (srv !== "network") {
    // use the network as the proxy
    env.push({
      name: "MICRO_PROXY",
      value: pulumi.interpolate`${networkService.metadata.name}.${networkService.metadata.namespace}:${networkService.spec.ports[0].port}`
    });
  }

  let serviceAccount: Output<string> | string = "default";
  if (srv === "runtime") {
    serviceAccount = runtimeServiceAccount.metadata.name;
  }

  return new k8s.apps.v1.Deployment(
    `micro-${srv}-deployment`,
    {
      metadata: {
        name: `micro-${srv}`,
        namespace: "server",
        labels: {
          name: srv,
          version: "latest",
          micro: "server"
        }
      },
      spec: {
        replicas,
        selector: {
          matchLabels: {
            name: srv,
            version: "latest",
            micro: "server"
          }
        },
        template: {
          metadata: {
            labels: {
              name: srv,
              version: "latest",
              micro: "server"
            },
            annotations: {
              "prometheus.io/scrape": "true",
              "prometheus.io/path": "/metrics",
              "prometheus.io/port": "9000"
            }
          },
          spec: {
            serviceAccount,
            containers: [
              {
                resources: {
                  limits: {
                    cpu: "1",
                    memory: "4Gi"
                  },
                  requests: {
                    cpu: "100m",
                    memory: "100Mi"
                  }
                },
                name: "micro",
                env,
                args: ["service", srv],
                image,
                imagePullPolicy,
                ports: [
                  {
                    name: `${srv}-port`,
                    containerPort: port
                  }
                ],
                readinessProbe: {
                  tcpSocket: {
                    port: `${srv}-port`
                  },
                  initialDelaySeconds: 5,
                  periodSeconds: 10
                },
                volumeMounts: [
                  {
                    name: "etcd-client-certs",
                    mountPath: "/certs/registry",
                    readOnly: true
                  }
                ]
              }
            ],
            volumes: [
              {
                name: "etcd-client-certs",
                secret: {
                  secretName: (etcd.clientTLS.spec as any).secretName
                }
              }
            ]
          }
        }
      }
    },
    { provider }
  );
}

export const networkDeployment = microDeployment("network", 8443);
export const networkService = new k8s.core.v1.Service(
  "micro-network-service",
  {
    metadata: {
      name: "micro-network",
      namespace: "server",
      labels: {
        name: "network",
        version: "latest",
        micro: "server"
      }
    },
    spec: {
      ports: [
        {
          name: "http",
          port: 8443,
          targetPort: 8443
        }
      ],
      selector: {
        name: "network",
        version: "latest",
        micro: "server"
      }
    }
  },
  { provider, dependsOn: networkDeployment }
);

export const authDeployment = microDeployment("auth", 8010);
export const brokerDeployment = microDeployment("broker", 8003);
export const configDeployment = microDeployment("config", 8081);
export const eventsDeployment = microDeployment("events", 8080);
export const registryDeployment = microDeployment("registry", 8000);
export const runtimeDeployment = microDeployment("runtime", 8088);
export const storeDeployment = microDeployment("store", 8002);

const server = [
  authDeployment,
  brokerDeployment,
  configDeployment,
  eventsDeployment,
  networkDeployment,
  registryDeployment,
  runtimeDeployment,
  storeDeployment
];

export const apiDeployment = new k8s.apps.v1.Deployment(
  "micro-api-deployment",
  {
    metadata: {
      name: "micro-api",
      namespace: "server",
      labels: {
        name: "api",
        version: "latest",
        micro: "server"
      }
    },
    spec: {
      replicas,
      selector: {
        matchLabels: {
          name: "api",
          version: "latest",
          micro: "server"
        }
      },
      template: {
        metadata: {
          labels: {
            name: "api",
            version: "latest",
            micro: "server"
          },
          annotations: {
            "prometheus.io/scrape": "true",
            "prometheus.io/path": "/metrics",
            "prometheus.io/port": "9000"
          }
        },
        spec: {
          containers: [
            {
              name: "micro",
              env: [
                {
                  name: "MICRO_API_RESOLVER",
                  value: "subdomain"
                },
                {
                  name: "MICRO_AUTH_PUBLIC_KEY",
                  valueFrom: {
                    secretKeyRef: {
                      name: (jwtCert.metadata as ObjectMeta).name,
                      key: "tls.crt"
                    }
                  }
                },
                {
                  name: "MICRO_AUTH_PRIVATE_KEY",
                  valueFrom: {
                    secretKeyRef: {
                      name: (jwtCert.metadata as ObjectMeta).name,
                      key: "tls.key"
                    }
                  }
                },
                {
                  name: "MICRO_PROFILE",
                  value: "platform_client"
                },
                {
                  name: "MICRO_PROXY",
                  value: pulumi.interpolate`${networkService.metadata.name}.${networkService.metadata.namespace}:${networkService.spec.ports[0].port}`
                },
                {
                  name: "MICRO_API_REDIS_ADDRESS",
                  value: redis.redis.uri
                },
                {
                  name: "MICRO_API_REDIS_USER",
                  value: redis.redis.user
                },
                {
                  name: "MICRO_API_REDIS_PASSWORD",
                  value: redis.redis.password
                }
              ],
              args: ["service", "api"],
              image,
              imagePullPolicy,
              ports: [
                {
                  name: "api-port",
                  containerPort: 8080
                }
              ],
              readinessProbe: {
                tcpSocket: {
                  port: `api-port`
                },
                initialDelaySeconds: 5,
                periodSeconds: 10
              }
            }
          ]
        }
      }
    }
  },
  { provider, dependsOn: [...server, jwtCert] }
);

export const apiService = new k8s.core.v1.Service(
  "micro-api-service",
  {
    metadata: {
      name: "micro-api",
      namespace: "server",
      labels: {
        name: "api",
        version: "latest",
        micro: "server"
      }
    },
    spec: {
      ports: [
        {
          name: "http",
          port: 8080,
          targetPort: 8080
        }
      ],
      selector: {
        name: "api",
        version: "latest",
        micro: "server"
      }
    }
  },
  { provider, dependsOn: apiDeployment }
);

export const proxyDeployment = new k8s.apps.v1.Deployment(
  "micro-proxy-deployment",
  {
    metadata: {
      name: "micro-proxy",
      namespace: "server",
      labels: {
        name: "proxy",
        version: "latest",
        micro: "server"
      }
    },
    spec: {
      replicas,
      selector: {
        matchLabels: {
          name: "proxy",
          version: "latest",
          micro: "server"
        }
      },
      template: {
        metadata: {
          labels: {
            name: "proxy",
            version: "latest",
            micro: "server"
          },
          annotations: {
            "prometheus.io/scrape": "true",
            "prometheus.io/path": "/metrics",
            "prometheus.io/port": "9000"
          }
        },
        spec: {
          containers: [
            {
              name: "micro",
              env: [
                {
                  name: "MICRO_AUTH_PUBLIC_KEY",
                  valueFrom: {
                    secretKeyRef: {
                      name: (jwtCert.metadata as ObjectMeta).name,
                      key: "tls.crt"
                    }
                  }
                },
                {
                  name: "MICRO_AUTH_PRIVATE_KEY",
                  valueFrom: {
                    secretKeyRef: {
                      name: (jwtCert.metadata as ObjectMeta).name,
                      key: "tls.key"
                    }
                  }
                },
                {
                  name: "MICRO_PROFILE",
                  value: "platform_client"
                },
                {
                  name: "MICRO_PROXY",
                  value: pulumi.interpolate`${networkService.metadata.name}.${networkService.metadata.namespace}:${networkService.spec.ports[0].port}`
                },
                {
                  name: "MICRO_API_REDIS_ADDRESS",
                  value: redis.redis.uri
                },
                {
                  name: "MICRO_API_REDIS_USER",
                  value: redis.redis.user
                },
                {
                  name: "MICRO_API_REDIS_PASSWORD",
                  value: redis.redis.password
                }
              ],
              args: ["service", "proxy"],
              image,
              imagePullPolicy,
              ports: [
                {
                  name: "proxy-port",
                  containerPort: 8081
                }
              ],
              readinessProbe: {
                tcpSocket: {
                  port: `proxy-port`
                },
                initialDelaySeconds: 5,
                periodSeconds: 10
              }
            }
          ]
        }
      }
    }
  },
  { provider, dependsOn: [...server, jwtCert] }
);

export const proxyService = new k8s.core.v1.Service(
  "micro-proxy-service",
  {
    metadata: {
      name: "micro-proxy",
      namespace: "server",
      labels: {
        name: "proxy",
        version: "latest",
        micro: "server"
      }
    },
    spec: {
      ports: [
        {
          name: "grpc",
          port: 8081,
          targetPort: 8081
        }
      ],
      selector: {
        name: "proxy",
        version: "latest",
        micro: "server"
      }
    }
  },
  { provider, dependsOn: proxyDeployment }
);

export const webDeployment = new k8s.apps.v1.Deployment(
  "micro-web-deployment",
  {
    metadata: {
      name: "micro-web",
      namespace: "server",
      labels: {
        name: "web",
        version: "latest",
        micro: "server"
      }
    },
    spec: {
      replicas,
      selector: {
        matchLabels: {
          name: "web",
          version: "latest",
          micro: "server"
        }
      },
      template: {
        metadata: {
          labels: {
            name: "web",
            version: "latest",
            micro: "server"
          },
          annotations: {
            "prometheus.io/scrape": "true",
            "prometheus.io/path": "/metrics",
            "prometheus.io/port": "9000"
          }
        },
        spec: {
          containers: [
            {
              name: "micro",
              env: [
                {
                  name: "MICRO_API_ADDRESS",
	          value: "https://api.m3o.com"
                },
                {
                  name: "MICRO_AUTH_PUBLIC_KEY",
                  valueFrom: {
                    secretKeyRef: {
                      name: (jwtCert.metadata as ObjectMeta).name,
                      key: "tls.crt"
                    }
                  }
                },
                {
                  name: "MICRO_AUTH_PRIVATE_KEY",
                  valueFrom: {
                    secretKeyRef: {
                      name: (jwtCert.metadata as ObjectMeta).name,
                      key: "tls.key"
                    }
                  }
                },
                {
                  name: "MICRO_PROFILE",
                  value: "platform_client"
                },
                {
                  name: "MICRO_PROXY",
                  value: pulumi.interpolate`${networkService.metadata.name}.${networkService.metadata.namespace}:${networkService.spec.ports[0].port}`
                },
                {
                  name: "MICRO_API_REDIS_ADDRESS",
                  value: redis.redis.uri
                },
                {
                  name: "MICRO_API_REDIS_USER",
                  value: redis.redis.user
                },
                {
                  name: "MICRO_API_REDIS_PASSWORD",
                  value: redis.redis.password
                }
              ],
              args: ["web"],
              image,
              imagePullPolicy,
              ports: [
                {
                  name: "web-port",
                  containerPort: 8082
                }
              ],
              readinessProbe: {
                tcpSocket: {
                  port: `web-port`
                },
                initialDelaySeconds: 5,
                periodSeconds: 10
              }
            }
          ]
        }
      }
    }
  },
  { provider, dependsOn: [...server, jwtCert] }
);

export const apiService = new k8s.core.v1.Service(
  "micro-web-service",
  {
    metadata: {
      name: "micro-web",
      namespace: "server",
      labels: {
        name: "web",
        version: "latest",
        micro: "server"
      }
    },
    spec: {
      ports: [
        {
          name: "http",
          port: 8082,
          targetPort: 8082
        }
      ],
      selector: {
        name: "web",
        version: "latest",
        micro: "server"
      }
    }
  },
  { provider, dependsOn: webDeployment }
);

export const jaegerDeployment = new k8s.apps.v1.Deployment(
  "micro-jaeger-deployment",
  {
    metadata: {
      name: "jaeger",
      namespace: "server",
      labels: {
        app: "jaeger",
        "app.kubernetes.io/name": "jaeger",
        "app.kubernetes.io/component": "all-in-one",
      }
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: "jaeger",
          "app.kubernetes.io/name": "jaeger",
          "app.kubernetes.io/component": "all-in-one",
        },
      },
      strategy: {
        type: "Recreate",
      },

     template: {
        metadata: {
          labels: {
            app: "jaeger",
            "app.kubernetes.io/name": "jaeger",
            "app.kubernetes.io/component": "all-in-one",
          },
          annotations: {
            "prometheus.io/scrape": "true",
            "prometheus.io/port": "16686"
          },
        },

       spec: {
          containers: [
            {
              name: "jaeger",
              env: [
                {
                  name: "COLLECTOR_ZIPKIN_HTTP_PORT",
                  value: "9411"
                },
              ],
              image: "jaegertracing/all-in-one",
              imagePullPolicy,
              ports: [
                {
                  containerPort: 5775,
                  protocol: "UDP"
                },
                {
                  containerPort: 6831,
                  protocol: "UDP"
                },
                {
                  containerPort: 6832,
                  protocol: "UDP"
                },
                {
                  containerPort: 5778,
                  protocol: "TCP"
                },
                {
                  containerPort: 16686,
                  protocol: "TCP"
                },
                {
                  containerPort: 9411,
                  protocol: "TCP"
                },
              ],
              readinessProbe: {
                httpGet: {
                  path: "/",
                  port: 14269
                },
                initialDelaySeconds: 5,
              }
            }
          ]
        }
      }
    }
  },
  { provider }
);

export const jaegerQueryService = new k8s.core.v1.Service(
  "jaeger-query",
  {
    metadata: {
      name: "jaeger-query",
      namespace: "server",
      labels: {
        app: "jaeger",
        "app.kubernetes.io/name": "jaeger",
        "app.kubernetes.io/component": "query",
      }
    },
    spec: {
      ports: [
        {
          name: "query-http",
          port: 80,
          protocol: "TCP",
          targetPort: 16686
        }
      ],
      selector: {
        "app.kubernetes.io/name": "jaeger",
        "app.kubernetes.io/component": "all-in-one"
      },
      type: "LoadBalancer"
    }
  },
  { provider, dependsOn: jaegerDeployment }
);

export const jaegerQueryCollector = new k8s.core.v1.Service(
  "jaeger-collector",
  {
    metadata: {
      name: "jaeger-collector",
      namespace: "server",
      labels: {
        app: "jaeger",
        "app.kubernetes.io/name": "jaeger",
        "app.kubernetes.io/component": "collector",
      }
    },
    spec: {
      ports: [
        {
          name: "jaeger-collector-tchannel",
          port: 14267,
          protocol: "TCP",
          targetPort: 14267
        },
        {
          name: "jaeger-collector-http",
          port: 14268,
          protocol: "TCP",
          targetPort: 14268
        },
        {
          name: "jaeger-collector-zipkin",
          port: 9411,
          protocol: "TCP",
          targetPort: 9411
        },
      ],
      selector: {
        "app.kubernetes.io/name": "jaeger",
        "app.kubernetes.io/component": "all-in-one"
      },
      type: "ClusterIP"
    }
  },
  { provider, dependsOn: jaegerDeployment }
);

export const jaegerAgent = new k8s.core.v1.Service(
  "jaeger-agent",
  {
    metadata: {
      name: "jaeger-agent",
      namespace: "server",
      labels: {
        app: "jaeger",
        "app.kubernetes.io/name": "jaeger",
        "app.kubernetes.io/component": "agent",
      }
    },
    spec: {
      ports: [
        {
          name: "agent-zipkin-thrift",
          port: 5775,
          protocol: "UDP",
          targetPort: 5775
        },
        {
          name: "agent-compact",
          port: 6831,
          protocol: "UDP",
          targetPort: 6831
        },
        {
          name: "agent-binary",
          port: 6832,
          protocol: "UDP",
          targetPort: 6832
        },
        {
          name: "agent-configs",
          port: 5778,
          protocol: "TCP",
          targetPort: 5778
        },
      ],
      clusterIP: "None",
      selector: {
        "app.kubernetes.io/name": "jaeger",
        "app.kubernetes.io/component": "all-in-one"
      },
    }
  },
  { provider, dependsOn: jaegerDeployment }
);

export const zipkin = new k8s.core.v1.Service(
  "zipkin",
  {
    metadata: {
      name: "zipkin",
      namespace: "server",
      labels: {
        app: "jaeger",
        "app.kubernetes.io/name": "jaeger",
        "app.kubernetes.io/component": "zipkin",
      }
    },
    spec: {
      ports: [
        {
          name: "jaeger-collector-zipkin",
          port: 9411,
          protocol: "TCP",
          targetPort: 9411
        },
      ],
      clusterIP: "None",
      selector: {
        "app.kubernetes.io/name": "jaeger",
        "app.kubernetes.io/component": "all-in-one"
      },
    }
  },
  { provider, dependsOn: jaegerDeployment }
);

export const pr = new ocean.ProjectResources("pr-micro", {
  project: project.id,
  resources: [storeBucket.bucketUrn, runtimeBucket.bucketUrn, eventsBucket.bucketUrn]
})


export default [
  microNamespace,
  serverNamespace,
  authDeployment,
  brokerDeployment,
  configDeployment,
  eventsDeployment,
  networkDeployment,
  registryDeployment,
  runtimeDeployment,
  storeDeployment,
  networkService,
  apiService,
  apiDeployment,
  proxyService,
  proxyDeployment
  webService,
  webDeployment,
];
