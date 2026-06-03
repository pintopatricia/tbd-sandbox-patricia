/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { json2ts } = require("json-ts");

const BRANDS = ["bf", "sbg"];

const TRANSLATIONS_PATHS = BRANDS.map((brand) => path.resolve(`./apps/${brand}/web/generated/translations`));

const OUTPUT_PATH = path.resolve("./packages/tbd-shared/translations", "keys.ts");
const TYPE_NAME = "TranslationKey";

const allTranslations = TRANSLATIONS_PATHS.flatMap((translationPath) =>
  fs
    .readdirSync(translationPath)
    .map((languageFilename) => path.resolve(translationPath, languageFilename))
    .map((languagePath) => fs.readFileSync(languagePath, "utf-8")),
);
const keysDefinition = json2ts(allTranslations, { rootName: TYPE_NAME, prefix: "" });
const exportedDefinition = keysDefinition
  .replace(new RegExp(`interface ${TYPE_NAME} `), `export type ${TYPE_NAME} = `)
  .replace(/'/g, '"')
  .replace(/ {4}/g, "  ")
  .replace(/\}\n/, "};");
const writeContent = `// THIS IS A TOOL GENERATED FILE. DO NOT CHANGE

${exportedDefinition}
`;

fs.writeFileSync(OUTPUT_PATH, writeContent);
