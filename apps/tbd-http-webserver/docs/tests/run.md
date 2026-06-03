# How to Run Regression Tests

At the root directory, generate the config-files:

```
$ yarn generate-config-files
```

To run locally the regression tests, switch to **_/apps/tbd-http-webserver_** and run:

```
$ yarn start:regression
```

> [!NOTE]
>
> - This command execute docker images with the strand + mock server + proxy

or

```
$ yarn fabric:regression
```

On the same path **_/apps/tbd-http-webserver_** in another terminal window:

```
$ yarn test:regression --watch
```

> [!NOTE]
>
> - We can run just one regression test with `--watch` flag and then **press P** to type the pattern of the filename we want just to test.
> - The terminal will display the **errors and missing mocks**.
> - Currently is possible to run TBD http webserver regression tests on merge request in the Github with **/http-webserver-tests** in the comments.
