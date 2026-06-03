import { areStatePropsEqual } from "./state-comparer";

const NOTIFICATION_MOCK = {
  id: "some id",
  message: "some message",
  detail: "some detail",
  type: "some type",
  items: ["item1", "item2"],
  url: "some url",
  showCloseIcon: true,
  dismissLabel: "some dismissLabel",
  gtmLabel: "some gtmLabel",
};
const STATE_MOCK = {
  notifications: [NOTIFICATION_MOCK],
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
      describe("and previous notifications size is different than next notifications size", () => {
        it("should return false", () => {
          expect(
            areStatePropsEqual({ notifications: [NOTIFICATION_MOCK] }, { notifications: [NOTIFICATION_MOCK] }),
          ).toBe(true);
        });
      });

      describe("and previous notifications size is equal to next notifications size", () => {
        function setup(prevNotification = {}, nextNotification = {}) {
          return areStatePropsEqual({ notifications: [prevNotification] }, { notifications: [nextNotification] });
        }

        describe.each([
          ["id", 1, 2],
          ["message", "some message 1", "some message 2"],
          ["detail", "some detail 1", "some detail 2"],
          ["type", "some type 1", "some type 2"],
          ["items", ["item1"], ["item2"]],
          ["url", "some url 1", "some url 2"],
          ["showCloseIcon", true, false],
          ["dismissLabel", "some dismissLabel 1", "some dismissLabel 2"],
          ["gtmLabel", "some gtmLabel 1", "some gtmLabel 2"],
        ])(`and "%s" properties are different`, (notificationKey, nextValue, prevValue) => {
          it("should return false", () => {
            expect(setup({ [notificationKey]: nextValue }, { [notificationKey]: prevValue })).toBe(false);
          });
        });

        describe("and all props are equal", () => {
          it("should return true", () => {
            expect(setup({ ...NOTIFICATION_MOCK }, { ...NOTIFICATION_MOCK })).toBe(true);
          });
        });
      });
    });
  });
});
