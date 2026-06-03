const path = require("path");

const glob = require("glob");
const { promisify } = require("util");
const { exec } = require("child_process");

let token = process.env.GITHUBTOKEN_NATIVE_VISUAL;

const execPromisified = promisify(exec);
const BASE_PATH = "../specs/visual/baselines/bf/ios/";

function downloadBaseline() {
  if (!token) {
    try {
      token = require("../specs/visual/baselines/bf/ios/config/download-baselines.json").github_token;
    } catch (error) {
      throw new Error(
        'A github token must be defined in order to download the baselines. Run "yarn generate-config-files" if you are running locally or pass the GITHUBTOKEN environment variable.',
      );
    }
  }

  const gitRepo = `https://${token}@github.com/Flutter-Global/tbd-native-visual-tests-baseline.git`;

  const baselineFolderExists =
    glob.sync(path.resolve(__dirname, `${BASE_PATH}/tbd-native-visual-tests-baseline/baselines/*.png`)).length !== 0;

  const baselinesBranch = process.env.BASELINES_BRANCH || "master";
  console.log(`Using baselines from branch: ${baselinesBranch}...`);

  if (!baselineFolderExists) {
    console.log(`Fetching Native Visual Tests Baseline`);

    return execPromisified(`git clone --depth 1 --branch ${baselinesBranch} ${gitRepo}`, {
      cwd: path.resolve(__dirname, BASE_PATH),
    }).catch((error) => {
      throw new Error(`Could not fetch visual baseline. Reason: ${error}`);
    });
  }
  console.log(`Pulling new images from repository...`);

  return execPromisified(
    `git fetch --all && git reset --hard HEAD && git clean -f -d && git checkout ${baselinesBranch} && git pull`,
    {
      cwd: path.resolve(__dirname, `${BASE_PATH}/tbd-native-visual-tests-baseline/baselines`),
    },
  ).catch((error) => {
    throw new Error(`Could not pull new images. Reason: ${error}`);
  });
}

module.exports = downloadBaseline;
