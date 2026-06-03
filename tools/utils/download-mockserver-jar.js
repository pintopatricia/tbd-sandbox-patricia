/* eslint-disable no-console */
/*
 * mockserver
 * http://mock-server.com
 *
 * Copyright (c) 2014 James Bloom
 * Licensed under the Apache License, Version 2.0
 */
/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const { http } = require("follow-redirects");
const fs = require("fs");
const glob = require("glob");

function downloadProxyJar(
  version = "5.15.0",
  artifactoryHost = "artifactory-prd.prd.betfair",
  artifactoryPath = "/artifactory/mockserver-netty/"
) {
  const binFolder = "./node_modules/.bin";
  const dest = `${binFolder}/mockserver-netty-${version}-jar-with-dependencies.jar`;
  const options = {
    host: artifactoryHost,
    path: `${artifactoryPath}${version}/mockserver-netty-${version}-jar-with-dependencies.jar`,
  };
  const mockserverURL = `https://${options.host}${options.path}`;
  const fsPath = `../../${binFolder}/mockserver-netty-${version}-jar-with-dependencies.jar`;

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path.resolve(__dirname, `../../${binFolder}/`))) {
      fs.mkdirSync(path.resolve(__dirname, `../../${binFolder}/`), { recursive: true });
    }

    const oldMockServerJars = glob.sync(
      path.resolve(__dirname, `../../${binFolder}/mockserver-netty-!(${version})-jar-with-dependencies.jar`)
    );

    const newMockServerJar = glob.sync(path.resolve(__dirname, fsPath));

    if (oldMockServerJars.length > 0) {
      console.log("Found duplicate versions of MockServer jar");
      oldMockServerJars.forEach((item) => {
        fs.unlinkSync(item);
        console.log(`Deleted ${item}`);
      });
    }

    if (newMockServerJar.length === 0) {
      console.log(`Fetching mockserver`);
      const req = http.request(options);

      req.once("error", (error) => {
        const errorMsg = `Fetching ${mockserverURL} failed with: ${error}\nMaybe try with NODE_TLS_REJECT_UNAUTHORIZED=0 ?`;
        console.error(errorMsg);
        reject(new Error(errorMsg));
      });

      req.once("response", (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const errorMsg = `Fetching ${mockserverURL} failed with HTTP status code ${res.statusCode}`;
          console.error(errorMsg);
          reject(new Error(errorMsg));
        }

        const writeStream = fs.createWriteStream(path.resolve(__dirname, fsPath));
        res.pipe(writeStream);

        writeStream.on("error", (error) => {
          const errorMsg = `Saving ${dest} failed with: ${error}`;
          console.error(errorMsg);
          reject(new Error(errorMsg));
        });
        writeStream.on("close", () => {
          console.log(`Saved ${dest} from ${mockserverURL}`);
          resolve();
        });
      });

      req.end();
    } else {
      console.log(`Skipping download of ${mockserverURL} as file already exists in ${fsPath}`);
      resolve();
    }
  });
}

module.exports = downloadProxyJar;
