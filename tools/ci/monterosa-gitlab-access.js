const os = require("os");
const { spawn } = require("child_process");

function detectOS() {
  const platform = os.platform();
  if (platform === "win32") {
    return "WIN";
  } else if (platform === "darwin") {
    return "MAC";
  } else if (platform === "linux") {
    return "LIN";
  } else {
    return "Unknown";
  }
}

function storeGitCredential(token) {
  let keychainName;
  const systemOS = detectOS();
  if (systemOS === "WIN") {
    keychainName = "wincred";
  } else if (systemOS === "MAC") {
    keychainName = "osxkeychain";
  } else if (systemOS === "LIN") {
    keychainName = "cache";
  } else {
    console.error("Unsupported OS");
    return;
  }

  return new Promise((resolve, reject) => {
    const child = spawn("git", ["credential-" + keychainName, "store"]);
    // trufflehog false positive, dynamic value
    const credentialData = `host=gitlab.com\npath=/monterosa-sdk\nprotocol=https\nusername=flutter\npassword=${token}\n\n`;

    child.stdin.write(credentialData);
    child.stdin.end();

    child.on("close", (code) => {
      if (code === 0) {
        resolve("Credential stored successfully");
      } else {
        reject(`Failed to store credential, exit code: ${code}`);
      }
    });

    child.on("error", (err) => {
      reject("Failed to store credential:", err);
    });
  });
}

const token = process.argv[2] || process.env.MONTEROSA_TOKEN;
if (!token) {
  console.error("GitLab token is required as a command-line argument");
  process.exit(1);
}

storeGitCredential(token)
  .then((result) => {
    console.log(result);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
