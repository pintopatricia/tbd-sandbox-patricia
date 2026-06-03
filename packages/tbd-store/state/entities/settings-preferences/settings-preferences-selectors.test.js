import { createSettingsPreferenceSelector } from "./settings-preferences-selectors";

const stateMock = {
  "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay": {
    urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
    selectedIndex: 0,
  },
};

const stateMock2 = {
  "ppb:tbd:preference:singleChoice:other": {
    urn: "ppb:tbd:preference:singleChoice:other",
    selectedIndex: 0,
  },
};

describe('"settings preferences" selectors', () => {
  describe("createSettingsPreferenceSelector", () => {
    it("should be a function factory", () => {
      const getSettingsPreference = createSettingsPreferenceSelector();
      expect(getSettingsPreference).toEqual(expect.any(Function));
      expect(getSettingsPreference).not.toBe(createSettingsPreferenceSelector());
    });

    describe("when state does not change", () => {
      it("should not recompute the selector", () => {
        const getSettingsPreference = createSettingsPreferenceSelector();
        getSettingsPreference(stateMock);
        getSettingsPreference(stateMock);

        expect(getSettingsPreference.recomputations()).toEqual(1);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const getSettingsPreference = createSettingsPreferenceSelector();
        getSettingsPreference(stateMock);
        getSettingsPreference(stateMock2);
        getSettingsPreference(stateMock2);

        expect(getSettingsPreference.recomputations()).toEqual(2);
      });
    });

    describe("when preference for requested urn exists", () => {
      it("should return the corresponding preference", () => {
        const getSettingsPreference = createSettingsPreferenceSelector();
        expect(getSettingsPreference(stateMock, "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay")).toStrictEqual(
          {
            urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
            selectedIndex: 0,
          },
        );
      });
    });

    describe("when preference for requested urn does not exists", () => {
      it("should return undefined", () => {
        const getSettingsPreference = createSettingsPreferenceSelector();
        expect(getSettingsPreference(stateMock, "ppb:tbd:preference:singleChoice:unknownPreference")).toBe(undefined);
      });
    });
  });
});
