const net = require("net");

const getUnusedPort = async () =>
  new Promise((resolve, reject) => {
    try {
      const server = net.createServer();

      server.listen(0, "localhost", () => {
        const { port } = server.address();
        server.close(() => {
          resolve(port);
        });
      });

      server.on("error", (error) => {
        try {
          server.close(() => reject(error));
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      reject(e);
    }
  });

exports.getUnusedPort = getUnusedPort;
