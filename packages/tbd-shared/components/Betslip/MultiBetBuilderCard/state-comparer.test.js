import { areStatePropsEqual } from "./state-comparer";

const GROUP_MOCK_ONE = {
  urn: "event:urn:1",
  title: "Event 1",
  legIds: ["LEG:1"],
};

const GROUP_MOCK_TWO = {
  urn: "event:urn:2",
  title: "Event 2",
  legIds: ["LEG:2"],
};

const STATE_MOCK = {
  groups: [GROUP_MOCK_ONE],
};

describe("areStatePropsEqual", () => {
  describe("when next state is false", () => {
    describe("and previous state is defined", () => {
      it("should return false", () => {
        expect(areStatePropsEqual(false, STATE_MOCK)).toBe(false);
      });
    });

    describe("and previous state is false", () => {
      it("should return true", () => {
        expect(areStatePropsEqual(false, false)).toBe(true);
      });
    });
  });

  describe("when next state is defined", () => {
    describe("and previous state is false", () => {
      it("should return false", () => {
        expect(areStatePropsEqual(STATE_MOCK, false)).toBe(false);
      });
    });

    describe("and previous state is defined", () => {
      describe("and previous group size is different than next group size", () => {
        it("should return false", () => {
          expect(
            areStatePropsEqual(
              { groups: { "event:urn:1": GROUP_MOCK_ONE } },
              { groups: { "event:urn:1": GROUP_MOCK_ONE, "event:urn:2": GROUP_MOCK_TWO } },
            ),
          ).toBe(false);
        });
      });

      describe("and previous group size is equal to next group size", () => {
        function setup(prevGroups = {}, nextGroups = {}) {
          return areStatePropsEqual({ groups: prevGroups }, { groups: nextGroups });
        }

        describe.each([
          ["urn", { urn: "event:urn:1" }, { urn: "event:urn:2" }],
          ["title", { urn: "event:urn:1", title: "Event 1" }, { urn: "event:urn:1", title: "Event 2" }],
          ["legIds", { urn: "event:urn:1", legIds: ["LEG:1"] }, { urn: "event:urn:1", legIds: ["LEG:2"] }],
        ])(`and "%s" properties are different`, (groupKey, prevValue, nextValue) => {
          it("should return false", () => {
            expect(setup({ [prevValue.urn]: prevValue }, { [prevValue.urn]: nextValue })).toBe(false);
          });
        });

        describe("and all props are equal", () => {
          it("should return true", () => {
            expect(setup({ "event:urn:1": GROUP_MOCK_ONE }, { "event:urn:1": GROUP_MOCK_ONE })).toBe(true);
          });
        });
      });
    });
  });
});
