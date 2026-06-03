const handlebars = require("handlebars");

function registerHandlebarsHelpers() {
  handlebars.registerHelper("defined", (obj) => typeof obj !== "undefined");
  handlebars.registerHelper("inc", (number1, number2) => {
    if (typeof number1 === "undefined" || typeof number2 === "undefined" || number1 === null || number2 == null)
      return null;
    return number1 + number2;
  });
  handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });
  handlebars.registerHelper("json", (obj) => JSON.stringify(obj));
  handlebars.registerHelper("isArray", (obj) => Array.isArray(obj));
  global.handlebars = handlebars;
}

module.exports = {
  registerHandlebarsHelpers,
};
