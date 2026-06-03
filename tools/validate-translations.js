const fs = require("fs");
const path = require("path");
const { json2ts } = require("json-ts");

const BRANDS = ["bf", "sbg"];
const APPS_BASE = "./apps";

const TYPE_NAME = "TranslationKey";

function extractKeysFromInterfaceString(interfaceStr) {
  // Regular expression to match the keys within the interface string
  const regex = /'([^']+)'/g;
  const matches = interfaceStr?.match(regex);
  // Remove the quotes from the matches
  return matches?.map((match) => match.replace(/'/g, "")) ?? [];
}

function findMissingTranslationKeys({
  brands,
  appsBase,
  readdirSync = fs.readdirSync,
  readFileSync = fs.readFileSync,
}) {
  let brandTranslations = [];
  const missingKeys = {};

  brandTranslations = brands.map((brand) => {
    const translationsPath = path.resolve(appsBase, brand, "web", "generated", "translations");
    const fileResult = readdirSync(translationsPath)
      .map((languageFilename) => path.resolve(translationsPath, languageFilename))
      .map((languagePath) => readFileSync(languagePath, "utf-8"));
    const keysDefinition = json2ts(fileResult, { rootName: TYPE_NAME, prefix: "" });

    const extractedKeys = extractKeysFromInterfaceString(keysDefinition);

    return [brand, extractedKeys];
  });

  // Compare translations for each brand against each other
  brands.forEach((brand, index) => {
    const otherBrands = brands.filter((_, i) => i !== index);
    const brandKeys = brandTranslations[index][1];
    otherBrands.forEach((otherBrand) => {
      const otherBrandKeys = brandTranslations.find(([b]) => b === otherBrand)[1];
      const missingFromOtherBrand = brandKeys.filter((key) => !otherBrandKeys.includes(key));
      if (missingFromOtherBrand.length > 0) {
        if (!missingKeys[brand]) {
          missingKeys[brand] = {};
        }
        missingKeys[brand][otherBrand] = missingFromOtherBrand;
      }
    });
  });
  return { missingKeys, brandTranslations };
}

function validateTranslations({ brands, appsBase }) {
  const { missingKeys, brandTranslations } = findMissingTranslationKeys({ brands, appsBase });
  if (Object.keys(missingKeys).length > 0) {
    Object.entries(missingKeys).forEach(([brand, otherBrands]) => {
      console.log(`The following translation keys exist in ${brand.toUpperCase()} translations`);
      Object.entries(otherBrands).forEach(([otherBrand, keys]) => {
        console.log(`but are missing in ${otherBrand.toUpperCase()} translations:\n`);
        keys.forEach((key) => {
          console.log(`${key}`);
        });
        console.log("\n");
      });
      console.log(
        "Please add any missing keys to the other brands' translations\n as components which use them will display incorrectly.\n",
      );
    });
  }
  validateComponentTranslations(APPS_BASE, brandTranslations[0][1]);
}

function validateComponentTranslations(appsBase, translationKeys) {
  // Find all .mjs files in node_modules/@ppb/tbd-components-*/dist/components/
  const pattern = path.resolve(appsBase, "../node_modules/@ppb/tbd-components-*/dist/components/**/*.mjs");
  const files = fs.globSync(pattern);

  let hasError = false;

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");
    // Regex to match "I18N. ... "
    const regex = /"((I18N\.[^"]+))"/g;
    (content.match(regex) ?? []).forEach((match) => {
      const key = match.replace(/"/g, "");
      if (!translationKeys.includes(key)) {
        hasError = true;
        console.log(`Missing I18N key in generated translations: "${key}" found in ${file}`);
        console.log("\n");
      }
    });
  });
}

if (require.main === module) {
  try {
    validateTranslations({
      brands: BRANDS,
      appsBase: APPS_BASE,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

module.exports = { findMissingTranslationKeys, extractKeysFromInterfaceString, validateComponentTranslations };
