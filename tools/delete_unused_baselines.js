/* eslint-disable */
const fs = require("fs").promises;
const path = require("path");

const { execSync, spawn } = require("child_process");

const args = process.argv.slice(2);
let foundFiles = false;

function parseArgs(args) {
  return args.reduce((result, arg) => {
    const [key, value] = arg.split("=");
    result[key] = value;
    return result;
  }, {});
}

function searchInRepo(string, repoPath) {
  return new Promise((resolve, reject) => {
    const grepProcess = spawn("grep", ["-irna", "--include=*.spec.js", string, ...repoPath]);
    let result = "";
    let error = "";

    grepProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    grepProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    grepProcess.on("close", (code) => {
      if (code === 0) {
        resolve(result.trim());
      } else {
        // No matches found
        if (!error.trim()) {
          resolve();
        }
        // Grep command failed
        reject(error.trim());
      }
    });
  });
}

(main = async () => {
  try {
    const data = parseArgs(args);

    if (!data.hasOwnProperty("tempBaselineRepoPathArg") || !data.hasOwnProperty("visualTestsPathArg")) {
      console.error('Error: The "tempBaselineRepoPathArg", "visualTestsPathArg" properties are required.');
      process.exit(1);
    }
    const { tempBaselineRepoPathArg, visualTestsPathArg } = data;

    const workspace = process.env.GITHUB_WORKSPACE;

    const tempBaselineRepoPath = path.join(workspace, tempBaselineRepoPathArg);
    const visualTestsPath = visualTestsPathArg.split(",").map((p) => path.join(workspace, p.trim()));

    console.log("Baselines path:", tempBaselineRepoPath);
    console.log("Exists:", require("fs").existsSync(tempBaselineRepoPath));

    const files = await fs.readdir(tempBaselineRepoPath);
    const regex = /\[(.*)\]_(.*?)(\-chrome\-|.png)/; // For regular cases [xxx]_abc-chrome-360px.png

    const filesPromises = files.map(async (file) => {
      const matches = file.match(regex);
      if (matches && matches[2]) {
        const content = matches[2];

        const result = await searchInRepo(content, visualTestsPath);
        if (!result) {
          console.log(`No results found for: ${content}`);
          execSync(`git rm '${file}'`, {
            cwd: tempBaselineRepoPath,
            stdio: "inherit",
          });
          console.log(`Removed successfully and added to git tracking...`);
          foundFiles = true;
        }
      } else {
        console.log(`The file '${file}' was not found in the baselines repository. Removing it...`);
        execSync(`git rm '${file}'`, { cwd: tempBaselineRepoPath, stdio: "inherit" });
        console.log(`Removed successfully and added to git tracking...`);
        foundFiles = true;
      }
    });

    Promise.all([...filesPromises]).then(() => {
      if (foundFiles) {
        console.log("Commiting changes to master...");
        execSync(`git status`, { cwd: tempBaselineRepoPath, stdio: "inherit" });
        execSync(`git config --local user.email "41898282+github-actions[bot]@users.noreply.github.com"`, {
          cwd: tempBaselineRepoPath,
          stdio: "inherit",
        });
        execSync(`git config --local user.name "github-actions[bot]"`, {
          cwd: tempBaselineRepoPath,
          stdio: "inherit",
        });
        execSync(`git commit -m "chore: delete unused baselines #NA"`, { cwd: tempBaselineRepoPath, stdio: "inherit" });
        console.log("Successfully commited changes!");
      } else {
        console.log("No baselines unused, good job!");
      }
    });
  } catch (err) {
    console.error("Error cloning baselines:", err.message);
  }
})();
