import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { validate, parse, GraphQLSchema, buildSchema } from "graphql";
import {
  PersistedQueryManifestOperation,
  generatePersistedQueryManifest,
} from "@apollo/generate-persisted-query-manifest";
import { cosmiconfig } from "cosmiconfig";
import { codegenFetch } from "@ppb/schema-loader-github";
import { readFileSync } from "node:fs";

const documentCache = {} as Record<string, PersistedQueryManifestOperation[]>;

/**
 * Load the config file
 * @param configFileLocation The path to the config
 * @returns The configuration object
 */
export async function getUserConfig(configFileLocation: string) {
  const explorer = cosmiconfig("persisted-query-manifest");
  const file = await explorer.load(configFileLocation);

  return file;
}

/**
 * Load all graphql documents based on the paths available on the config file
 *
 * @param configFilePath The GeneratePersistedQueryManifest config file
 * @returns A list of AST documents
 */
export async function loadAllDocuments(configFilePath: string): Promise<PersistedQueryManifestOperation[]> {
  // Get user config (no defaults)
  const result = await getUserConfig(configFilePath);

  // Check cache first
  const cache = documentCache[configFilePath];
  if (cache !== undefined) {
    return documentCache[configFilePath];
  }

  // Load all documents
  const documents = await generatePersistedQueryManifest(
    {
      documents: result?.config.documents,
      createOperationId: result?.config.createOperationId,
    },
    undefined,
  );

  // Feed cache
  documentCache[configFilePath] = documents.operations;

  return documents.operations;
}

async function getSchema(schemaPath: string): Promise<GraphQLSchema> {
  // Find schema
  let isUrlSchema = false;
  let url;
  try {
    url = new URL(schemaPath);
    isUrlSchema = url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    isUrlSchema = false;
  }

  if (isUrlSchema && url) {
    const response = await codegenFetch(url.toString(), {});
    const schemaText = await response.text();
    return buildSchema(schemaText);
  }
  return loadSchemaSync(schemaPath, {
    loaders: [new GraphQLFileLoader()],
  });
}

/**
 * Given a list of AST operations (e.g. query, mutation) validates that against
 * a schema.
 *
 * @param operations A list of AST objects
 * @param schemaFilePath The path to a schema to validate against
 * @returns A list of AST documents
 */
export async function validateDocuments(
  operations: PersistedQueryManifestOperation[],
  schemaPath: string,
): Promise<PersistedQueryManifestOperation[]> {
  // schema
  const schema = await getSchema(schemaPath);

  // Validate all generated queries against schema
  return operations.map((operation) => {
    const document = parse(operation.body);
    const validationErrors = validate(schema, document);

    if (validationErrors && validationErrors.length > 0) {
      throw new Error(`Document is invalid ${validationErrors}`);
    }

    return operation;
  });
}

/**
 * Uses loadAllDocuments() and find which generated AST correspond to the
 * provided filepath.
 *
 * @param configFilePath The GeneratePersistedQueryManifest config file
 * @param resourceFilePath The filepath to use as search (useful for babel/webpack plugins)
 * @returns An AST document
 */
export async function getDocument(
  configFilePath: string,
  resourceFilePath: string,
): Promise<PersistedQueryManifestOperation> {
  // Find the operation name and type
  const data = readFileSync(resourceFilePath);
  const regex = /.*(mutation|query|subscription)\s+(\w*).*/gm;
  const result = regex.exec(data.toString());

  if (result === null) {
    throw new Error(`Resource file is incompatible: ${resourceFilePath}`);
  }

  // Find the operation on the full list
  const [, operationType, operationName] = result;
  const documents = await loadAllDocuments(configFilePath);

  const document = documents.find(
    (doc: { name: string; type: string }) => doc.name === operationName && doc.type === operationType,
  );

  if (!document) {
    throw new Error(`Can't find proper document. ${operationType} ${operationName}`);
  }

  return document;
}
