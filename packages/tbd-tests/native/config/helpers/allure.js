const { addAttachment } = require("@wdio/allure-reporter");

const stopAndSaveVideo = async () => {
  if (browser.capabilities.recordVideo || browser.capabilities["appium:recordVideo"]) {
    const video = await driver.stopRecordingScreen();
    addAttachment(`Execution video`, Buffer.from(video, "base64"), "video/webm");
  }
};

module.exports = {
  stopAndSaveVideo,
};
