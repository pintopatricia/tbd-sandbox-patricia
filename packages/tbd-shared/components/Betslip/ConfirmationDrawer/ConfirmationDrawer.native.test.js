import { UI__ACCEPT_CONFIRMATION, UI__REFUSE_CONFIRMATION } from "@ppb/tbd-store/actions/confirmation";
import { ComponentTheme } from "@ppb/the-wall-common/types";
import { ConfirmDrawer } from "@ppb/the-wall-native";
import { render } from "@testing-library/react-native";
import { ConfirmationDrawer } from "./ConfirmationDrawer.native";

jest.mock("@ppb/the-wall-native", () => ({
  ConfirmDrawer: jest.fn(() => <confirm-drawer-mock />),
}));

const defaultLabels = {
  accept: "accept",
  refuse: "refuse",
  title: "title",
  subtitle: "subtitle",
};

function renderConfirmationDrawer(props = {}) {
  return render(<ConfirmationDrawer {...props} />);
}

describe("ConnectedConfirmationDrawer", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should call ConfirmDrawer", () => {
    renderConfirmationDrawer({});

    expect(ConfirmDrawer).toHaveBeenCalled();
    expect(ConfirmDrawer).toHaveBeenCalledTimes(1);
  });

  it("should pass the title to ConfirmDrawer", () => {
    renderConfirmationDrawer({ title: "title" });

    expect(ConfirmDrawer).toHaveBeenCalledWith(expect.objectContaining({ title: "title" }), undefined);
  });

  it("should pass the subtitle to ConfirmDrawer", () => {
    renderConfirmationDrawer({ subtitle: "subtitle" });

    expect(ConfirmDrawer).toHaveBeenCalledWith(expect.objectContaining({ subtitle: "subtitle" }), undefined);
  });

  it("should pass the refuse to ConfirmDrawer", () => {
    renderConfirmationDrawer({ refuse: "refuse" });

    expect(ConfirmDrawer).toHaveBeenCalledWith(expect.objectContaining({ refuseLabel: "refuse" }), undefined);
  });

  it("should pass the accept to ConfirmDrawer", () => {
    renderConfirmationDrawer({ accept: "accept" });

    expect(ConfirmDrawer).toHaveBeenCalledWith(expect.objectContaining({ acceptLabel: "accept" }), undefined);
  });

  it("should have a dark Theme", () => {
    renderConfirmationDrawer({});

    expect(ConfirmDrawer).toHaveBeenCalledWith(expect.objectContaining({ theme: ComponentTheme.Dark }), undefined);
  });

  it("should pass onRefuseTap", () => {
    renderConfirmationDrawer({});

    expect(ConfirmDrawer).toHaveBeenCalledWith(
      expect.objectContaining({ onRefuseTap: expect.any(Function) }),
      undefined,
    );
  });

  it("should pass onAcceptTap", () => {
    renderConfirmationDrawer({});

    expect(ConfirmDrawer).toHaveBeenCalledWith(
      expect.objectContaining({ onAcceptTap: expect.any(Function) }),
      undefined,
    );
  });

  it("should pass onOutsideTap", () => {
    renderConfirmationDrawer({});

    expect(ConfirmDrawer).toHaveBeenCalledWith(
      expect.objectContaining({ onOutsideTap: expect.any(Function) }),
      undefined,
    );
  });

  describe("when refusing", () => {
    it("should call dispatchActions with refuse actions + confirm refuse", () => {
      const dispatchActions = jest.fn();
      renderConfirmationDrawer({
        ...defaultLabels,
        dispatchActions,
        refuseActions: [{ x: "x", payload: { clickedOutside: false } }],
      });
      const { onRefuseTap } = ConfirmDrawer.mock.calls[0][0];

      onRefuseTap();

      expect(dispatchActions).toHaveBeenCalledWith(
        [
          { x: "x", payload: { clickedOutside: false } },
          { type: UI__REFUSE_CONFIRMATION, payload: { clickedOutside: false } },
        ],
        defaultLabels.refuse,
      );
    });
  });

  describe("when accepting", () => {
    it("should call dispatchActions with accept actions + confirm accept", () => {
      const dispatchActions = jest.fn();
      renderConfirmationDrawer({ ...defaultLabels, dispatchActions, acceptActions: ["x"] });
      const { onAcceptTap } = ConfirmDrawer.mock.calls[0][0];

      onAcceptTap();

      expect(dispatchActions).toHaveBeenCalledWith(["x", { type: UI__ACCEPT_CONFIRMATION }], defaultLabels.accept);
    });
  });

  describe("when outside tapping", () => {
    it("should call dispatchActions with refuse actions + confirm refuse", () => {
      const dispatchActions = jest.fn();
      renderConfirmationDrawer({
        ...defaultLabels,
        dispatchActions,
        refuseActions: [{ x: "x", payload: { clickedOutside: true } }],
      });
      const { onOutsideTap } = ConfirmDrawer.mock.calls[0][0];

      onOutsideTap();

      expect(dispatchActions).toHaveBeenCalledWith(
        [
          { x: "x", payload: { clickedOutside: true } },
          { type: UI__REFUSE_CONFIRMATION, payload: { clickedOutside: true } },
        ],
        defaultLabels.refuse,
      );
    });
  });
});
