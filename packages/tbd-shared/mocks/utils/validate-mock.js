const path = require("path");
const tsj = require("ts-json-schema-generator");
const validate = require("jsonschema").validate;

const validateBFFMock = (mockType, mock) => {
  const type = mockType.split("Fragment")[0];

  if (!browser.options["graphQL:validate"]) {
    return;
  }

  const config = {
    path: path.resolve(__dirname, "../../../tbd-store/clients/catalogue/catalogue-response-types.ts"),
    tsconfig: path.resolve(__dirname, "../../tsconfig.json"),
    type: mockType,
    skipTypeCheck: true,
  };

  // creates a json schema based on the type of the View Fragment in catalogue-response-types.ts
  const schema = tsj.createGenerator(config).createSchema(config.type);

  // validates the json that will be served by the mockserver againts the json schema generated
  const response = validate(JSON.parse(mock).data.View, schema, {
    disableFormat: false,
    nestedErrors: true,
  });

  const filteredErrors = response.errors.filter((error) => {
    // when optional even if we have a value it always validates against null as well, so filter those errors
    if (error.schema.type === "null") return false;
    // in union types when the instance doesn't fully match any type it returns an error that isn't very helpful
    if (error.message.includes("is not any of [subschema")) return false;
    // in union types it compares the typename against all possibilities, so these are false errors
    if (error.path.includes("__typename") && error.message.includes("does not exactly match expected constant"))
      return false;

    // just checking if the instance has a typename, if it doesn't have its ok anyway
    if (!error.instance || !error.instance.__typename) return true;
    // given that the instance has a typename, the schema for that instance needs to have a typename as well
    if (!error.schema.properties || !error.schema.properties.__typename) return false;

    // if the typename of the instance is not equal to the typename of the schema for that instance, the error should be ignored
    if (error.instance._typename !== error.schema.properties.__typename) return false;

    return true;
  });

  const numberOfErrors = filteredErrors.length;

  if (numberOfErrors > 0) {
    // changing the log colour to red, console.error doesn't work
    console.log("\x1b[31m");
    console.log(`Found ${numberOfErrors} issues in the ${type} mock`);

    filteredErrors.forEach((error, index) => {
      console.log(`${error.toString()}`);
    });
    // reseting the log color
    console.log("\x1b[0m");
  } else {
    // changing the log colour to green
    console.log("\x1b[32m");
    console.log(`Found 0 issues in the ${type} mock`);
    // reseting the log color
    console.log("\x1b[0m");
  }
};

module.exports = {
  validateBFFMock,
};
