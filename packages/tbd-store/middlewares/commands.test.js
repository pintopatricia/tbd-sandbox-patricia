import { PUSH, PUSH_SAME_VIEW } from "../actions";
import { BETTING__SBK_ADD_SELECTIONS } from "../actions/betting";
import { URL__BETSLIP_DEEPLINK } from "../actions/commands";
import { resolveAppCommands } from "../modules/commands-resolver";

import { commandsMiddleware } from "./commands";

jest.mock("../modules/commands-resolver", () => ({
  resolveAppCommands: jest.fn(),
}));

function setup({
  dispatchSpy = jest.fn(),
  nextSpy = jest.fn(),
  action = { type: "some action", payload: "some payload" },
} = {}) {
  return commandsMiddleware({
    dispatch: dispatchSpy,
  })(nextSpy)(action);
}

describe("Commands middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should forward action to next middlewares", () => {
    const actionMock = {
      type: "some action",
      payload: "some payload",
    };
    const nextSpy = jest.fn();
    setup({ nextSpy, action: actionMock });
    expect(nextSpy).toHaveBeenCalledWith(actionMock);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  describe("when action is PUSH", () => {
    describe("and there are app commands", () => {
      it("should call resolveAppCommands to resolve app commands", () => {
        const dispatchSpy = jest.fn();
        resolveAppCommands.mockReturnValue(["CMD1", "CMD2"]);

        setup({
          action: {
            type: PUSH,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
        });

        expect(resolveAppCommands).toHaveBeenCalledWith(expect.any(Function), "some viewUrl");
        expect(resolveAppCommands).toHaveBeenCalledTimes(1);
      });

      it("should dispatch COMMANDS__INIT with commands", () => {
        const dispatchSpy = jest.fn();
        resolveAppCommands.mockReturnValue(["CMD1", "CMD2"]);
        setup({
          action: {
            type: PUSH,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
        });
        expect(dispatchSpy).toHaveBeenCalledWith({ type: "COMMANDS/INIT", payload: ["CMD1", "CMD2"] });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("and there are not app commands", () => {
      it("should call resolveAppCommands to resolve app commands", () => {
        const dispatchSpy = jest.fn();
        resolveAppCommands.mockReturnValue(undefined);

        setup({
          action: {
            type: PUSH,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
        });

        expect(resolveAppCommands).toHaveBeenCalledWith(expect.any(Function), "some viewUrl");
        expect(resolveAppCommands).toHaveBeenCalledTimes(1);
      });

      it("should not dispatch COMMANDS__INIT", () => {
        const dispatchSpy = jest.fn();
        resolveAppCommands.mockReturnValue(undefined);
        setup({
          action: {
            type: PUSH,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
        });
        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action is PUSH_SAME_VIEW", () => {
    describe("and there are app commands", () => {
      it("should call resolveAppCommands to resolve app commands", () => {
        const dispatchSpy = jest.fn();
        resolveAppCommands.mockReturnValue(["CMD1", "CMD2"]);

        setup({
          action: {
            type: PUSH_SAME_VIEW,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
        });

        expect(resolveAppCommands).toHaveBeenCalledWith(expect.any(Function), "some viewUrl");
        expect(resolveAppCommands).toHaveBeenCalledTimes(1);
      });
      it("should dispatch COMMANDS__INIT with commands", () => {
        const dispatchSpy = jest.fn();
        resolveAppCommands.mockReturnValue(["CMD1", "CMD2"]);
        setup({
          action: {
            type: PUSH_SAME_VIEW,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
        });
        expect(dispatchSpy).toHaveBeenCalledWith({ type: "COMMANDS/INIT", payload: ["CMD1", "CMD2"] });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("and there are not app commands", () => {
      it("should call resolveAppCommands to resolve app commands", () => {
        const dispatchSpy = jest.fn();
        resolveAppCommands.mockReturnValue(undefined);

        setup({
          action: {
            type: PUSH_SAME_VIEW,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
        });

        expect(resolveAppCommands).toHaveBeenCalledWith(expect.any(Function), "some viewUrl");
        expect(resolveAppCommands).toHaveBeenCalledTimes(1);
      });

      it("should not dispatch COMMANDS__INIT", () => {
        const dispatchSpy = jest.fn();
        resolveAppCommands.mockReturnValue(undefined);
        setup({
          action: {
            type: PUSH_SAME_VIEW,
            payload: {
              viewUrn: "some viewUrn",
              viewUrl: "some viewUrl",
            },
          },
          dispatchSpy,
        });
        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action is URL__BETSLIP_DEEPLINK", () => {
    it("should put BETTING__SBK_ADD_SELECTIONS with given selections and REAL group", () => {
      const dispatchSpy = jest.fn();
      const selectionsMock = ["some selection", "another selection"];

      setup({
        action: {
          type: URL__BETSLIP_DEEPLINK,
          payload: {
            selections: selectionsMock,
            isBetSharing: true,
          },
        },
        dispatchSpy,
      });

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_ADD_SELECTIONS,
        payload: {
          selections: selectionsMock,
          group: "REAL",
          deeplink: {
            isBetSharing: true,
          },
        },
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
