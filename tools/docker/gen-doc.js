const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const ajv = new Ajv({ allErrors: true });

function loadWithExtends(configPath) {
  const configDir = path.dirname(configPath);

  console.log(`Loading config: ${configPath}`);

  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  if (config.$extends) {
    const basePath = path.resolve(configDir, config.$extends);
    const baseConfig = loadWithExtends(basePath);

    const { $extends, ...rest } = config;
    return { ...baseConfig, ...rest };
  }

  return config;
}

function validateConfig(config, schemaPath) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const validate = ajv.compile(schema);
  const valid = validate(config);

  if (!valid) {
    console.error("Configuration validation failed:");
    console.error(JSON.stringify(validate.errors, null, 2));
    process.exit(1);
  }

  console.log("Configuration validated successfully");
  return config;
}

function loadConfig(configPath, schemaPath) {
  // Automatically find schema in the same directory as config file
  const configDir = path.dirname(configPath);
  const autoSchemaPath = path.join(configDir, "..", "config.schema.json");
  const defaultSchemaPath = fs.existsSync(autoSchemaPath)
    ? autoSchemaPath
    : path.join(__dirname, "../../apps/bf/web/config/common/config.schema.json"); // TODO: When migrate to other brands, make this script brand-agnostic

  const schema = schemaPath || defaultSchemaPath;

  const config = loadWithExtends(configPath);
  return validateConfig(config, schema);
}

function configToEnv(config) {
  return (
    Object.entries(config)
      .filter(([key]) => !key.startsWith("$"))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n") + "\n"
  );
}

function generateEnvFile(configPath, outputPath, schemaPath) {
  const config = loadConfig(configPath, schemaPath);
  const envContent = configToEnv(config);

  const absolutePath = path.resolve(outputPath);
  fs.writeFileSync(absolutePath, envContent);
  console.log(`Generated ${absolutePath}`);
}

if (require.main === module) {
  const configPath = process.argv[2];
  const outputPath = process.argv[3] || ".env";

  if (!configPath) {
    console.error("Usage: node config-loader.js <config.json> [output.env]");
    process.exit(1);
  }

  generateEnvFile(configPath, outputPath);
}

module.exports = {
  loadConfig,
  loadWithExtends,
  validateConfig,
  configToEnv,
  generateEnvFile,
};
