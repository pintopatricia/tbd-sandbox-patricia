import validateOptions from "schema-utils";
import { getDocument } from "./core";

export default function tbdGqldocLoader(this: any) {
  const options = this.getOptions();
  const callback = this.async();
  const { resourcePath } = this;

  validateOptions(
    {
      type: "object",
      properties: {
        option: {
          type: "boolean",
        },
      },
    },
    options,
  );

  getDocument(options.configFilePath, resourcePath).then((document) => {
    const output = options.useDocumentId ? document.id : document.body;
    callback(null, `export default \`${output}\`;`);
  });
}
