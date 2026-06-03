/* eslint-disable no-console, no-await-in-loop */
const { networkInterfaces } = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { execSync } = require("child_process");
const { nanoid } = require("nanoid");
const { REGEX_PORT_HOST } = require("../config/consts");

const { PATH_HOST, HOST_IP, PWD, JOB_NAME, BUILD_NUMBER } = process.env;

// Property that has the function to create a MockServer Instance
// This way we can override it easily on other configuration files
const createProxyInstance = async (capabilities, openIngressPorts, containerIds, cidIndex) => {
  const mockServerVersion = "docker.app.betfair/mockserver/mockserver:5.15.0";

  const nets = networkInterfaces();
  let ipAddress = HOST_IP;

  for (const name of Object.keys(nets)) {
    for (const netAddr of nets[name]) {
      // Skip over non-IPv4, internal (i.e. 127.0.0.1) addresses, and local interfaces (i.e. 192.168.1.78)
      if (netAddr.family === "IPv4" && !netAddr.internal && netAddr.address.startsWith("10.")) {
        ipAddress = netAddr.address;
      }
    }
  }

  if (!ipAddress) {
    console.error("Could not find a valid IPv4 10.xx.xx.xx address, needs to contemplate new interfaces");
    process.exit(1);
  }

  let port = null;
  let spawnedContainerId = null;

  const preferredPort = openIngressPorts[cidIndex % openIngressPorts.length];
  const portsToTry = [preferredPort, ...openIngressPorts.filter((p) => p !== preferredPort)];

  for (const testPort of portsToTry) {
    const dockerId = `${JOB_NAME}_${BUILD_NUMBER}_${nanoid()}`;
    console.log(`Trying port ${testPort} with dockerId: ${dockerId}`);
    const dockerRunCommand = PATH_HOST
      ? `docker run -d --name ${dockerId} -v ${PATH_HOST}/native/helpers:/config -p ${testPort}:1080 --env MOCKSERVER_INITIALIZATION_JSON_PATH=/config/mockInitializer.json ${mockServerVersion}`
      : `docker run -d --name ${dockerId} -v ${PWD}/helpers:/config -p ${testPort}:1080 --env MOCKSERVER_INITIALIZATION_JSON_PATH=/config/mockInitializer.json ${mockServerVersion}`;

    try {
      port = testPort;
      const containerId = execSync(dockerRunCommand).toString();
      spawnedContainerId = containerId;

      containerIds.push(spawnedContainerId);
      console.log(`Container started with id: ${spawnedContainerId} on port ${port}`);
      break;
    } catch (err) {
      console.log(`Failed to start on port ${testPort}`);
    }

    if (spawnedContainerId) break;
  }

  const timeoutFn = (ms) => {
    let timer;
    return {
      cancel: () => {
        if (timer) {
          clearTimeout(timer);
        }
      },
      start: () =>
        new Promise((_resolve, reject) => {
          timer = setTimeout(
            () => reject(new Error(`${ms}ms Passed and no valid response from the container. Aborting...`)),
            ms,
          );
        }),
    };
  };

  const fetchFn = () => {
    let skip = false;

    return {
      cancel() {
        skip = true;
      },
      async start() {
        const { stdout, stderr } = await exec(`docker logs ${spawnedContainerId}`);
        // Eventually remove
        if (stderr) console.error("STDERR ON START: ", stderr);

        const REGEX_PORT = /port:\s+(\d+)/;
        const REGEX_ERROR_MOCKINITIALIZER = /Exception while loading "\/config\/mockInitializer\.json"/;
        if (REGEX_ERROR_MOCKINITIALIZER.exec(stdout)) {
          return Promise.reject(new Error("ERROR WHILE PASSING MOCKINITIALIZER TO MOCKSERVER. PATH IS NOT CORRECT"));
        }

        const [, portNumber] = REGEX_PORT.exec(stdout) || [];
        if (!portNumber && !skip) {
          return this.start();
        }
        return Promise.resolve();
      },
    };
  };

  const fetch = fetchFn();
  const timeout = timeoutFn(20000);

  // When the container starts, it'll start printing some logs until the point where the port is logged (last instruction, after initializing all the mock initializers and the service itself). We've to wait until this port is logged, OR a timeout is reached in order to not be stuck in a loop.
  await Promise.race([fetch.start(), timeout.start()]).then(
    () => {
      timeout.cancel();
    },
    async (error) => {
      fetch.cancel();
      console.error("Reject promise on reading container logs: ", error);
      const { stderr } = await exec(`docker stop ${spawnedContainerId}`);
      // Eventually remove
      if (stderr) console.error("STDERR ON STOP: ", stderr);
      return process.exit(1);
    },
  );

  let listPortMappingsRetries = 2;

  while (!port && listPortMappingsRetries) {
    // eslint-disable-next-line no-await-in-loop
    const { stdout, stderr } = await exec(`docker port ${spawnedContainerId}`);

    if (stderr) {
      console.error(`Error while fetching docker port. Reason: ${stderr}`);
      return process.exit(1);
    }

    const [, PORT] = REGEX_PORT_HOST.exec(stdout) || [];
    port = PORT;

    if (!port) {
      listPortMappingsRetries -= 1;
      console.log("MOCKPORT not caught, re-trying...");
    }
  }

  if (!port) {
    console.error(`Error while fetching docker port.`);
    const { stderr } = await exec(`docker stop ${spawnedContainerId}`);
    // Eventually remove
    if (stderr) console.error("STDERR ON STOP: ", stderr);
    return process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log(`Mock server running on: ${ipAddress}:${port}`);

  const optionalIntArgs = `--es environment mockserver --es MOCKHOST ${ipAddress} --es MOCKHOSTPORT ${port}`;
  if (capabilities["appium:optionalIntentArguments"]) {
    // eslint-disable-next-line no-console
    console.log(`Assigning appium:optionalIntentArguments: MOCKHOST ${ipAddress} - MOCKPORT ${port}`);
    /* eslint-disable no-param-reassign */
    capabilities["appium:optionalIntentArguments"] = optionalIntArgs;
    browser.capabilities["appium:optionalIntentArguments"] = optionalIntArgs;
  } else if (capabilities.optionalIntentArguments) {
    console.log(`Assigning optionalIntentArguments: MOCKHOST ${ipAddress} - MOCKPORT ${port}`);
    /* eslint-disable no-param-reassign */
    browser.capabilities.optionalIntentArguments = optionalIntArgs;
    capabilities.optionalIntentArguments = optionalIntArgs;
  }

  const processArguments = capabilities["appium:processArguments"] || capabilities.processArguments;
  if (processArguments) {
    // eslint-disable-next-line no-console
    console.log(`Assigning appium:processArguments: MOCKHOST ${ipAddress} - MOCKPORT ${port}`);
    Object.assign(processArguments.args, [
      `--environment=mockserver`,
      `--MOCKHOST=${ipAddress}`,
      `--MOCKHOSTPORT=${port}`,
    ]);
  }
  return containerIds;
};
exports.createProxyInstance = createProxyInstance;
