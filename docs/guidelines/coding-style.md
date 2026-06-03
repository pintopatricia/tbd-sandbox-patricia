# Linting + Formatter

## ESLint vs TSLint

Decision: ESLint

Reasons:

- The [roadmap issue](https://github.com/Microsoft/TypeScript/issues/29288) on the TypeScript repository seems to suggest that they're going to use eslint rather than tslint
- TSLint's airbnb is not actually being maintained by Airbnb and does not include the rules for react as the eslint-config-airbnb does
- Performance
- Community

## Parser

@typescript-eslint/parser

- An ESLint custom parser which leverages TypeScript ESTree to allow for ESLint to lint TypeScript source code

## Configs

eslint-config-prettier

- Turns off all rules that are unnecessary or might conflict with Prettier

## Plugins

eslint-plugin-react-hooks

- Eslint plugin for react hooks
- [Rules](https://reactjs.org/docs/hooks-rules.html)

eslint-plugin-jsx-a11y

- Static AST checker for accessibility rules on JSX elements
- [Rules](https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules)

eslint-plugin-react

- React specific linting rules for ESLint
- [Rules](https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules)

typescript-eslint

- Allow you to use ESLint and TypeScript together
- [Rules](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules)

eslint-plugin-prettier

- Runs Prettier as an ESLint rule and reports differences as individual ESLint issues
- Rules: [Prettier defaults](https://prettier.io/docs/en/options.html) or overrides in `.prettierrc`

## IDE Setup (VSCode example)

Extensions:

- [VSCode ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [VSCode EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) (if you want your IDE to read the configs in `.editorconfig`)

Configs:

- By default the ESLint plugin only runs on javascript and javascriptreact files. To tell it to run on TS files, you need to update the eslint.validate setting to:

```json
"eslint.validate": [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact"
]
```

- If you want to format the code with prettier when you save a file you need to add the following setting:

```json
"editor.formatOnSave":  true,
```
