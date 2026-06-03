import { useContext } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { BetDetailsAction, BetDetailsColor } from "@ppb/the-wall-common/types";
import { BetDetails } from "@ppb/the-wall-web";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";
import { OneLineBet } from "./OneLineBet.web";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({ isBetConfirmationStep: false, isDesktopLayout: false })),
}));

jest.mock("../BetControls", () => jest.fn(() => <connected-bet-controls-mock />));
jest.mock("../BetControls/BetControls.web", () => ({
  BetControls: jest.fn(() => <bet-controls-component-mock />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  BetDetails: jest.fn(() => <bet-details-mock />),
}));

jest.mock(
  "@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/LottoSelections/LottoSelections.web",
  () => jest.fn((props) => <lotto-selections-mock data-testid="lotto-selections" {...props} />),
);

const mockRunnerUrns = ["runner:urn:1", "runner:urn:2"];

function renderOneLineBet({
  runnerUrns = mockRunnerUrns,
  runners = [],
  isPlacing = false,
  selectionTypeIcon,
  hasAvailabilityHints = false,
  shouldFocusStakeField = false,
  id = "id",
  legId = "legId",
  subtitle = "subtitle",
  dispatchRemoveSelectionAction = jest.fn(),
} = {}) {
  return render(
    <OneLineBet
      shouldFocusStakeField={shouldFocusStakeField}
      runnerUrns={runnerUrns}
      id={id}
      legId={legId}
      subtitle={subtitle}
      hasAvailabilityHints={hasAvailabilityHints}
      selectionTypeIcon={selectionTypeIcon}
      runners={runners}
      isPlacing={isPlacing}
      dispatchRemoveSelectionAction={dispatchRemoveSelectionAction}
    />,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

const mockRunners = [
  {
    runnerURN: "runner:urn:1",
    selectionId: 1,
    name: "1",
    resultType: null,
  },
  {
    runnerURN: "runner:urn:2",
    selectionId: 2,
    name: "2",
    resultType: null,
  },
];

const dispatchRemoveSelectionAction = jest.fn();
describe("OneLineBet", () => {
  beforeEach(jest.clearAllMocks);

  describe("when has all props with correct values", () => {
    beforeEach(() => {
      renderOneLineBet({
        runners: mockRunners,
        id: "1",
        legId: "legId",
        subtitle: "Some market - some event",
        selectionTypeIcon: "selectionTypeIcon",
        dispatchRemoveSelectionAction,
      });
    });

    it("should call BetDetails with proper values", () => {
      expect(BetDetails).toHaveBeenCalledWith(
        {
          title: expect.any(Object),
          subtitle: "Some market - some event",
          action: BetDetailsAction.Remove,
          color: BetDetailsColor.Teal,
          selectionTypeIcon: "selectionTypeIcon",
          onAction: expect.any(Function),
          isPlacing: false,
          displayAllSubtitleText: false,
        },
        undefined,
      );
      expect(BetDetails).toHaveBeenCalledTimes(1);
    });

    it("should call ConnectedBetControls", () => {
      expect(ConnectedBetControls).toHaveBeenCalledWith(
        {
          component: BetControls,
          shouldFocusStakeField: false,
          combinationId: "1",
          hasAvailabilityHints: false,
        },
        undefined,
      );
      expect(ConnectedBetControls).toHaveBeenCalledTimes(1);
    });

    describe("when selection action is called", () => {
      it("should call dispatchRemoveSelectionAction callback with selection", () => {
        BetDetails.mock.calls[0][0].onAction();

        expect(dispatchRemoveSelectionAction).toHaveBeenCalledWith({ legId: "legId", runnerUrns: mockRunnerUrns });
        expect(dispatchRemoveSelectionAction).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when in CONFIRM_POTENTIAL step", () => {
    it("should not pass a callback action", () => {
      useContext.mockReturnValue({ isBetConfirmationStep: true, isDesktopLayout: false });
      renderOneLineBet({});

      expect(BetDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          action: BetDetailsAction.None,
          onAction: undefined,
        }),
        undefined,
      );
    });
  });
});
