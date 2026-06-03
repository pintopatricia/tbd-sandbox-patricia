import path from "path";
import resolve from "resolve";
import * as BabelTypes from "@babel/types";
import { Visitor, NodePath } from "@babel/traverse";
import { createSyncFn } from "synckit";
import { globSync } from "glob";
import { getDocument } from "./core";

type GetDocument = typeof getDocument;

type Babel = {
  types: typeof BabelTypes;
};

type BabelOptions = {
  config: {
    useDocumentId: boolean;
    configFilePath: string;
  }[];
};

function isGraphQLQueryExtension(filePath: string): boolean {
  const extension = path.extname(filePath);
  return [".gql", ".graphql"].includes(extension);
}

function replaceNode(
  visitorPath: NodePath<BabelTypes.ImportDeclaration>,
  visitorState: VisitorState,
  types: typeof BabelTypes,
  variableName: string,
  queryPath: string,
  useDocumentId: boolean,
  configFilePath: string,
): void {
  const absPath = resolve.sync(queryPath, { basedir: path.dirname(visitorState.filename) });
  const getDocumentSync = createSyncFn<GetDocument>(require.resolve("./workers/get-document"));
  const document = getDocumentSync(configFilePath, absPath);
  const output = useDocumentId ? document.id : document.body;
  const variableDeclaration = types.variableDeclaration("const", [
    types.variableDeclarator(types.identifier(variableName), types.stringLiteral(output)),
  ]);

  visitorPath.replaceWith(variableDeclaration);
}

type VisitorState = {
  filename: string;
};

export default (babel: Babel, options: BabelOptions): { visitor: Visitor<VisitorState> } => {
  const { types } = babel;
  const { config } = options;

  const getUserConfigSync = createSyncFn<(path: string) => Promise<string[]>>(
    require.resolve("./workers/get-config-globs"),
  );

  return {
    visitor: {
      ImportDeclaration(visitorPath, visitorState) {
        const { node } = visitorPath;
        const { specifiers, source } = node;

        if (specifiers.length === 0) {
          return;
        }

        const [specifier] = specifiers;
        const { type, local } = specifier;

        if (type === "ImportDefaultSpecifier") {
          const { value: queryPath } = source;

          // Fast check to fail fast
          if (!isGraphQLQueryExtension(queryPath)) {
            return;
          }

          const result = config.find(({ configFilePath }) => {
            const documents = getUserConfigSync(configFilePath);
            const list = globSync(documents);
            const absPath = resolve.sync(queryPath, { basedir: path.dirname(visitorState.filename) });

            return list.includes(absPath);
          });

          if (!result) {
            return;
          }

          replaceNode(
            visitorPath,
            visitorState,
            types,
            local.name,
            queryPath,
            result.useDocumentId,
            result.configFilePath,
          );
        }
      },
    },
  };
};
