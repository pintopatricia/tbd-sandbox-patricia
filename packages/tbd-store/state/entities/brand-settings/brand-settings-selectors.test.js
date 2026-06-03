import { createIsBrandSettingEnabledSelector } from "./brand-settings-selectors";

const stateMock = {
  entities: {
    brandSettings: {
      SHOW_SELECTION_TYPE_ICON: true,
      SHOW_HEADER: false,
    },
  },
};

describe("Brand Settings Selectors", () => {
  describe("createIsBrandSettingEnabledSelector", () => {
    describe("when the specified brand setting is enabled", () => {
      it("should return true", () => {
        expect(createIsBrandSettingEnabledSelector()(stateMock, "SHOW_SELECTION_TYPE_ICON")).toEqual(true);
      });
    });

    describe("when the specified brand setting is disabled", () => {
      it("should return false", () => {
        expect(createIsBrandSettingEnabledSelector()(stateMock, "SHOW_HEADER")).toEqual(false);
      });
    });

    describe("when the specified brand setting does not exist", () => {
      it("should return false", () => {
        expect(createIsBrandSettingEnabledSelector()(stateMock, "SOME_OTHER_SETTING")).toEqual(false);
      });
    });

    describe("when brand settings does not exist", () => {
      it("should return false", () => {
        expect(
          createIsBrandSettingEnabledSelector()({ entities: { brandSettings: undefined } }, "SHOW_SELECTION_TYPE_ICON"),
        ).toEqual(false);
      });
    });
  });
});
