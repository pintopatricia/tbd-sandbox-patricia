# OpenAPI Generator Client Generation Guide

The OpenAPI Generator CLI is a powerful tool that creates client libraries, server stubs, and documentation from OpenAPI definitions. This folder contains clients generated using this tool. Please don't update these files since they are generated.

The following command generates a TypeScript client using the Fetch API, based on the specified OpenAPI definition:

```
openapi-generator-cli generate -g typescript-fetch -o ./clients/__generated__/bme -i ./clients/__generated__/bme/openapi-configs.yaml
```

The BME OpenAPI definition can be found here: https://github.com/Flutter-Global/bme-service/blob/master/bme-openapi/bme-openapi-spec/src/main/resources/openapi-configs.yaml. Each service should have theirs.

You can find more info here: https://openapi-generator.tech/docs/usage/
