# Root Node Scripts

> `yarn prepare`

Ensures that `yarn run build` is done on workspaces, for workspaces that need it.

> `yarn lint`

Runs [eslint] for all `.js`, `.ts`, `.tsx` files under the `app` directory.

> `yarn format`

Applies [prettier] code formatter to all `.ts`, `.tsx` and `.js` files.

> `yarn check:nodeversion`

Executes a script that validates user node version with the one configured in our pipelines.

> `yarn get-translations`

Downloads translation files from lokalise. If you don't have the translations-tool installed run the command below.

_Note_: To be able to run `get-translations`, it is necessary to be whitelisted in Vault for the TLA in question, either as an individual user or as part of a whitelisted team (belong to team's DL). To avoid having to input vault login(s) when running the task, a `.lokalise_token` file can be created, with a key-value pair, `tla:lokalise_api_key` (tbd:lokalise_api_key). The api key can be obtained from vault or lokalise itself.

> `yarn install-translations-tool`

Installs the translations-tool package using `pip`.

> `yarn mono:prepublish`

Publishes **an alpha version** of all public packages within TBD monorepo. The generated versions are based on semver and inferred based on the git history. They should look like "`@ppb/the-wall-web@1.2.0-alpha.0`" and the semver version is calculated as:

- _patch_: if commit type is `fix:`
- _minor_: if commit type is `feat:`
- _major_: if commit any commit message container "`BREAKING CHANGE: ...`" in the footer

(more about conventional commit messages at [CONTRIBUTING.MD](CONTRIBUTING.md))

> `yarn mono:publish`

Similar to `yarn mono:prepublish`, but this time versions are identified as stable and so, it should look like `@ppb/the-wall-web@1.2.0`.

(more about TBD versioning system at [package versioning ADR](docs/decisions/0006-package-versioning.md))

# Native

### Node Scripts

List of tooling scripts

> `yarn lint`

Runs [eslint] for all the native code inside the native folder and also all `.native` files that are located at the `src` folder which is shared with web

> `yarn test`

Runs [jest tests] for all the native code inside the native folder and also all `.native` files that are located at the `src` folder which is shared with web

## iOS

This section contains instructions on how to configure and start up an iOS project.

### Installing

Navigate to `./ios` and run:

> `bundle install && bundle exec pod install`

### Running

Start up the metro bundler server:

> `yarn start`

From a new terminal session launch the project.

### Launching the project

It is possible to use the services from a specific environment (mockserver, qa, nxt drk, prf or prd). In order to use those, run:

> `yarn ios:<environment>` (e.g. `yarn run ios:qa`)

This task is responsible to define the environment passed as an argument on `app.config.json` with the key `TBDN_DEFAULT_ENVIRONMENT`. The actual default is `qa`.

As an alternative, the app can be run using the bff services from the local environment.  
To do this, the dev server containers need to be built and started:

> `yarn run docker:build`

> `yarn run docker:start`

It is then possible to launch the app:

> `yarn run ios`

After use the application, to stop all generated containers:

> `yarn run docker:stop`

### Set Release Mode

There are 2 release modes, one `internal` for apps that will be used internally on PPB and `production` for the apps that will be released on the app store. To define a specific release mode (internal or production) run:

> `yarn releaseMode:<releaseMode>`

This task is responsible to define the release mode passed as an argument on `app.config.json` with the key `TBDN_RELEASE_MODE`. It is used to distinguish types of releases.

- Release mode equal to `internal` includes Debug and InHouse build configurations.
- Release mode equal to `production` includes Release build configurations.

### Troubleshooting

#### Cache issues

If you see an incorrect theme (logo, design tokens, etc), it's most likely a caching issue.
Metro is very agressive regarding the caching, if you have issues with the cache not considering your changes, you can try the following:

First try:

```sh
yarn start:clean
```

If it doesn't work you can try:

```sh
 watchman watch-del-all
 rm -rf $TMPDIR/react-native-packager-cache-*
 rm -rf $TMPDIR/metro-bundler-cache-*
```

# Web

> `yarn build`

Builds all docker images needed to run TBD mobile web in a development environment. Including:

- TBD web app
- http-webserver strand
- Reverse proxy (nginx) for services to be consumed by TBD web app (including the Catalog strand (aka "bff-gql"))

**_Note:_** Every time there's a new version of the http-webserver strand or a new dependency is added to the workspace, you'll need to run `yarn build` to update the corresponding docker images.

> `yarn build:dev`

Similar to `yarn build`, but also builds the Catalog strand

**_Note:_** Every time there's a new version of a strand (ex. http-webserver, or catalog) or a new dependency is added to the workspace, you'll need to run `yarn build` to update the corresponding docker images.

> `yarn start:[ENV]` (where `ENV = dev or qa`)

Launches TBD's docker containers spinning up strands and [webpack-dev-server] as the development web server. Optimized for development providing source maps, watch mode and HMR.
Notice that, depending on the target environment different containers might be spinned up. Ex. if the target is QA, the Catalog container won't be run.

> `yarn start`

Falls back to `yarn start:qa`, which means that by default the Catalog strand will be consumed from QA env.

> `yarn stop`

Shuts down containers that were started by `yarn start`

> `yarn build:prod`

Builds TBD's artifacts optimized for production using [webpack].
Plus, it generates a [webpack manifest] file stating the output generated by [webpack] in order for the http-webserver server to be aware about which assets must be served.

> `yarn start:prod`

Launches the following different docker services (establishing a network between them):

- _webserver_: a web server (nginx) serving static assets produced by `yarn build` (JS, CSS and other static assets like fonts and images)
- _http-webserver_: : a strand responsible for managing the user access to the app and serving the app Document (`index.html`).
- _bff-gql_: : a strand responsible aggregating several services in the backend into a single service to be consumed by the server using GraphQL.
- _reverseproxy_: a reverse proxy (nginx) redirecting requests from the FE to the corresponding strands and/or services in the BE

> `yarn stop:prod`

Shuts down containers that were started by `yarn start:prod`

> `yarn lint`

Runs [eslint] for all `.js`, `.ts`, `.tsx` files under the `app` directory.

> `yarn format`

Applies [prettier] code formatter to all `.ts`, `.tsx` and `.js` files.

> `start-vnc`

This task will start a VNC connection to the docker container where the grid runs, it will prompt for password which is _secret_. If the connection is successful, you should see the workspace of your container.
