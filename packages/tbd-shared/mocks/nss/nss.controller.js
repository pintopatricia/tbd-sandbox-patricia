const readMockTemplate = require("../read-mock-template");

const BASE_PATH = ".*NotificationSubscription.*";

const getNSSRegister = () => ({
  pathRegex: `${BASE_PATH}/register.*`,
  method: "POST",
  statusCode: 200,
  delay: 0,
});

const getNSSSubscribe = (mockObject) => {
  const template = readMockTemplate(`${__dirname}/data/nss-subscribe-mock.hbs`, mockObject);

  return {
    pathRegex: `${BASE_PATH}/subscribeToEvents.*`,
    response: template,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const getNSSSubscribeSuccess = (mockObject) => {
  const template = readMockTemplate(`${__dirname}/data/nss-subscribe-success-mock.hbs`, mockObject);

  return {
    pathRegex: `${BASE_PATH}/subscribeToEvents.*`,
    response: template,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const getNSSSubscribeSuccessWithHR = (mockObject) => {
  const template = readMockTemplate(`${__dirname}/data/nss-subscribe-success-with-hr-mock.hbs`, mockObject);

  return {
    pathRegex: `${BASE_PATH}/subscribeToEvents.*`,
    response: template,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const getNSSSubscribePartial = (mockObject) => {
  const template = readMockTemplate(`${__dirname}/data/nss-subscribe-partial-mock.hbs`, mockObject);

  return {
    pathRegex: `${BASE_PATH}/subscribeToEvents.*`,
    response: template,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const getNSSSubscribeUnavailable = (mockObject) => {
  const template = readMockTemplate(`${__dirname}/data/nss-subscribe-unavailable-mock.hbs`, mockObject);

  return {
    pathRegex: `${BASE_PATH}/subscribeToEvents.*`,
    response: template,
    method: "POST",
    statusCode: 200,
    delay: 0,
  };
};

const getNSSUnsubscribe = () => ({
  pathRegex: `${BASE_PATH}/unsubscribeFromEvents.*`,
  method: "POST",
  statusCode: 200,
  delay: 0,
});

module.exports = {
  getNSSRegister,
  getNSSSubscribe,
  getNSSUnsubscribe,
  getNSSSubscribeSuccess,
  getNSSSubscribeSuccessWithHR,
  getNSSSubscribePartial,
  getNSSSubscribeUnavailable,
};
