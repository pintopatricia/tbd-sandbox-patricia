## Managing npm dependencies across monorepo

> ### Current problem

- There is no easy way to upgrade a package across all workspaces.
- When we add or update a dependency on multiple workspaces manually, we might end up with 2 versions of the same lib in our bundles which might lead to conflicts on other dependencies which use the dependency we are currently installing.
- Version mismatch on the same dependency across workspaces can lead to the following issues:
  1. we wouldn't benefit from hoisting for mismatched versions, what was [one of our motivations for using yarn as package manager](https://github.com/Flutter-Global/tbd/blob/master/docs/decisions/0010-package-management.md)
  2. there might be conflicts between version mismatch like (for instance) this issue: https://github.com/storybookjs/storybook/issues/9241#issuecomment-569798785
  3. we might end up importing multiple versions of the very same dependency into our final bundles (ex. react), which would hurt bundle size and therefore, performance.

---

> ### Yarn's workspace protocol and Syncpack

- Packages that already adopted the Yarn's workspace protocol don't need to be published whenever there is a new change to them.
- [`syncpack`](https://github.com/JamieMason/syncpack) is used for keeping "Consistent dependency versions in large JavaScript Monorepos".
- This library aims to minimize version mismatches on the same dependencies across the workspace in an easy and efficient manner.
- If offers a command line interface for simplifying the process of bulk updating dependencies across multiple Yarn Workspace packages or it can even fix the mismatches without user's input.
- It runs automatically in the `pre-commit` hook or we can run it manually with `yarn syncpack:list` and `yarn syncpack:fix`.

---

> ### Using `yalc` for testing changes during development on dependencies (e.g. the-wall packages as an example)

1. Publish the needed packages from the changed repo (the-wall) to yalc store `yarn dlx yalc publish`.
Script to publish all packages:
```sh
for dir in packages/*; do (cd "$dir" && yarn dlx yalc publish); done
```

2. Go to the TBD app or package folder, where you want to add the published yalc changed packages, and add them through `yarn dlx yalc add [PACKAGE_NAME]`
Script to add all packages:
```sh
yarn dlx yalc add @ppb/the-wall-common @ppb/the-wall-icons @ppb/the-wall-theme @ppb/the-wall-web @ppb/the-wall-native
```

3. Do a `yarn install`

4. When development finishes

```sh
yarn dlx yalc remove --all
yarn install
```
