const { BaseSO } = require("@ppb/wdio-lazy-element");
const {
  NOTIFICATIONS_SUBSCRIPTION,
  NOTIFICATIONS_SUBSCRIPTION_PRESSABLE,
  NOTIFICATIONS_ICON_ON,
  NOTIFICATIONS_ICON_OFF,
  NOTIFICATIONS_SUBSCRIPTION_TOGGLE,
  NOTIFICATIONS_SUBSCRIPTION_BELL,
} = require("./NotificationsSubscription.native.selectors");

class NotificationSubscriptionSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${NOTIFICATIONS_SUBSCRIPTION}`));
  }

  get notificationsSubscriptionPressable() {
    return this.element.$(`~${NOTIFICATIONS_SUBSCRIPTION_PRESSABLE}`);
  }

  get notificationsIconOn() {
    return this.element.$(`~${NOTIFICATIONS_ICON_ON}`);
  }

  get notificationsIconOff() {
    return this.element.$(`~${NOTIFICATIONS_ICON_OFF}`);
  }

  get notificationsBell() {
    return this.element.$(`~${NOTIFICATIONS_SUBSCRIPTION_BELL}`);
  }

  get notificationsToggle() {
    return this.element.$(`~${NOTIFICATIONS_SUBSCRIPTION_TOGGLE}`);
  }
}

module.exports = NotificationSubscriptionSO;
