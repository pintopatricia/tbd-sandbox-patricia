# Product Cluster

## Overview

`PRODUCT_CLUSTER` identifies which product cluster a strand is running in:

| Value   | Meaning                                            |
| ------- | -------------------------------------------------- |
| `"EXC"` | Exchange cluster — used by the Exchange TLA tbdexc |
| `"SBK"` | Sportsbook cluster — used by other TLAs            |

The value is injected at the infrastructure level by Chef and is consumed by the Webserver strand to support routing and product-specific decisions.

---

## How It Gets Into the Runtime

### 1. Infrastructure (Chef)

Chef writes `PRODUCT_CLUSTER` into the server's `environment.json` file via each TLA's ERB template:

```erb
"PRODUCT_CLUSTER": "<%= node["product_cluster"] %>"
```

Each TLA's template resolves this to `"SBK"` or `"EXC"` depending on the cluster the node belongs to.

### 2. Local Development

Local replicas of the Chef-generated file live under:

```
apps/tbd-http-webserver/lib/config/env-templates/
  environment-bf.qa.json
  environment-bf.nxt.json
  environment-bf.qacms.json
  environment-sbg.qa.json
  environment-sbg.nxt.json
  environment-sbg.qacms.json
  environment-pp.qa.json
  environment-pp.nxt.json
  environment-ps.qa.json
  environment-ps.nxt.json
```

All local templates are seeded with `"PRODUCT_CLUSTER": "SBK"`. The active local config used by the webserver is `apps/tbd-http-webserver/lib/config/environment.json`.

> Do **not** add `PRODUCT_CLUSTER` to `*-backend.json` files — those serve a different purpose and are not part of the Chef-injected environment shape.

---

## Runtime Data Flow (Web / Webserver strand)

```
Chef ERB template
  └─► /etc/webserver/environment.json   (server)
        └─► unsafeEnvironmentFile        (static import in controller.ts)
              └─► buildEnvironmentForJurisdiction()
                    │  resolves {domain_extension}/{domain} placeholders;
                    │  all other fields, including PRODUCT_CLUSTER, pass through unchanged
                    └─► buildAppContext()
                          └─► mapEnvironment()
                                └─► buildAppConfigEnvironment()
                                      │  destructures PRODUCT_CLUSTER from EnvironmentJSON
                                      └─► EnvironmentConfig   (in-memory, typed)
                                            └─► appSuitableEnvironment
                                                  └─► htmlTemplate()  (serialised into FPI HTML)
```

Key files involved:

| File                                                          | Role                                                                                                                                |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `apps/tbd-http-webserver/lib/controller.ts`                   | Loads `environment.json`; calls `buildEnvironmentForJurisdiction` per request                                                       |
| `packages/tbd-store/helpers/app-environment.ts`               | `buildEnvironmentForJurisdiction` (pass-through) and `buildAppConfigEnvironment` (projects `EnvironmentJSON` → `EnvironmentConfig`) |
| `packages/tbd-store/clients/catalogue/app-context-builder.ts` | `mapEnvironment` calls `buildAppConfigEnvironment`; `PRODUCT_CLUSTER` is included in the returned config                            |
| `packages/tbd-store/state/initial-state/Environment.types.ts` | Type definitions — see below                                                                                                        |

---

## Runtime Data Flow (Native apps)

Native apps do not use the Webserver strand or the Chef-managed `environment.json` file. Instead they bootstrap natively and fetch the environment payload over HTTP via `getAppEnvironment()`:

```
getAppEnvironment(endpoint)          (HTTP GET → app environment endpoint)
  └─► EnvironmentJSON                (response parsed as EnvironmentJSON)
        └─► buildEnvironmentForJurisdiction()
              └─► buildAppContext()
                    └─► store initialised with EnvironmentConfig (includes PRODUCT_CLUSTER)
```

This path is driven by `app-context-saga.ts` in `packages/tbd-store/middlewares/`.

---

## Type Contract

```typescript
// packages/tbd-store/state/initial-state/Environment.types.ts

// Raw Chef-injected shape
export type EnvironmentJSON = {
  // ...
  PRODUCT_CLUSTER: "SBK" | "EXC";
  // ...
};

// In-memory, app-processed shape (subset of EnvironmentJSON)
export type EnvironmentConfig = Pick<
  EnvironmentJSON,
  "PRODUCT_CLUSTER"
  // ... other fields
> & {
  /* computed fields */
};
```

`PRODUCT_CLUSTER` is a **required** field on both types. Any object claiming to satisfy `EnvironmentJSON` must include it.

---

## Adding a New TLA

When onboarding a new TLA:

1. The Chef ERB template for that TLA must inject `PRODUCT_CLUSTER` with the correct value (`"SBK"` or `"EXC"`).
2. A corresponding local env-template file should be added under `apps/tbd-http-webserver/lib/config/env-templates/` (if the TLA uses the Webserver strand), seeded with the appropriate value.

> The `*-backend.json` files in that directory are **not** part of this pattern and should not include `PRODUCT_CLUSTER`.
