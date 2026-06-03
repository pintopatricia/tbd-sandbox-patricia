export const alertTitleElement = async (title) =>
  driver.findElement("xpath", `//android.widget.TextView[@text='${title}']`);

export const settingsAppElement = async (app) =>
  driver.findElement("xpath", `//android.widget.LinearLayout[@content-desc='${app}']`);

export const alertButtonElement = async (buttonText) =>
  driver.findElement("xpath", `//android.widget.Button[@text='${buttonText}']`);

export const settingsViewElement = async () =>
  driver.findElement("xpath", `//android.widget.FrameLayout[@package='com.android.settings']`);

export const permissionSwitchElement = async () =>
  driver.findElement("xpath", `//android.widget.Switch[@package='com.android.settings']`);

export const switchOnElement = async () => driver.findElement("xpath", `//android.widget.Switch[@checked='true']`);

export const toastElement = async () => driver.findElement("xpath", `//android.widget.Toast[@text='Download started']`);

export const applicationViewElement = async () =>
  driver.findElement("xpath", `//android.widget.FrameLayout[@package='com.betfair.tbd.inhouse']`);

export const playStoreElement = async () =>
  driver.findElement("xpath", `//android.widget.FrameLayout[@package='com.android.vending']`);
