export const alertTitleElement = async (title) =>
  driver.findElement("xpath", `//XCUIElementTypeStaticText[@name='${title}']`);

export const alertButtonElement = async (buttonText) =>
  driver.findElement("xpath", `//XCUIElementTypeButton[@label='${buttonText}']`);

export const applicationViewElement = async () =>
  driver.findElement("xpath", `//XCUIElementTypeApplication[@name='Betfair']`);
