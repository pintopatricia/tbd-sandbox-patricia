import yargs from "yargs";
import { readFile, writeFile } from "fs/promises";
import { loadAllDocuments, validateDocuments } from "./core";

const { argv } = yargs
  .usage("Usage: $0 -c config_location -s schema_location -p true|false")
  .option("c", {
    alias: "config",
    describe: "Config file location",
    demandOption: "The config file location is mandatory.",
    type: "string",
    nargs: 1,
  })
  .option("s", {
    alias: "schema",
    describe: "Schema file location",
    demandOption: "The schema file location is mandatory.",
    type: "string",
    nargs: 1,
  })
  .option("p", {
    alias: "persistOldQueries",
    describe: "Persist old queries?",
    demandOption: "The persist old queries is mandatory.",
    type: "boolean",
    nargs: 1,
  })
  .option("o", {
    alias: "outputFilePath",
    describe: "Output file path",
    demandOption: "The output filepath is mandatory.",
    type: "string",
    nargs: 1,
  });

(async function start() {
  const args = await argv;

  // Load all documents and validate them
  const documents = await loadAllDocuments(args.c);
  const validatedDocuments = await validateDocuments(documents, args.s);

  // Adapt the apollo format to the BFF one. This might be deleted in the future.
  let output = validatedDocuments.reduce(
    (acc, doc) => {
      acc[doc.id] = doc.body;
      return acc;
    },
    {} as Record<string, string>,
  );

  // We need to append the new queries to the old ones
  if (args.p) {
    const data = await readFile(args.o);
    const currentQueries = JSON.parse(data.toString());

    Object.keys(output).forEach((key) => {
      currentQueries[key] = output[key];
    });

    output = currentQueries;
  }

  await writeFile(args.o, JSON.stringify(output));
})();
