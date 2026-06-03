const getConnectivityCheck = ({ path = ".*connectivitycheck.gstatic.com/generate_204.*" }) => {
  return {
    pathRegex: path,
    response: "",
    method: "GET",
    statusCode: 204,
  };
};

module.exports = {
  getConnectivityCheck,
};
