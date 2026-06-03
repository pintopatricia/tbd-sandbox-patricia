const {
  VIEW_ZONE_CONTAINER,
  VIEW_ZONE_TITLE,
} = require("@ppb/tbd-shared/components/ViewZone/ViewZone.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ViewZoneSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${VIEW_ZONE_CONTAINER}`));
  }

  get viewZoneTitle() {
    return this.element.$(`~${VIEW_ZONE_TITLE}`);
  }
}

module.exports = ViewZoneSO;
