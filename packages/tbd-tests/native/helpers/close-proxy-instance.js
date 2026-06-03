const util = require("util");
const exec = util.promisify(require("child_process").exec);

// Property that has the function to kill a MockServer Instance created with the createProxyInstance function
// This way we can override it easily on other configuration files
const closeProxyInstance = async (containerIds) => {
  // eslint-disable-next-line no-console
  console.log("Killing mockserver instance:", containerIds);
  containerIds.forEach(async (pid) => {
    try {
      const { stderr } = await exec(`docker stop ${pid}`);
      // eslint-disable-next-line no-console
      if (stderr) console.error(`Error while stoping docker container: ${stderr}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`Got error trying to kill process of pid ${pid}`, err);
    }
  });

  return [];
};

exports.closeProxyInstance = closeProxyInstance;
