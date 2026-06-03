import { useContext } from "react";
import { render } from "@testing-library/react";
import { Modal, BottomSheet, MarketBlurbs, SegmentedControl } from "@ppb/the-wall-web";

import ObbPlayersModal from "./ObbPlayersModal.web";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isDesktopLayout: false,
  })),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Modal: jest.fn(({ children, props }) => <modal-mock {...props}>{children}</modal-mock>),
  SegmentedControl: jest.fn(({ children, props }) => <segmented-control {...props}>{children}</segmented-control>),
  BottomSheet: jest.fn(({ children, props }) => <bottom-sheet-mock {...props}> {children} </bottom-sheet-mock>),
  MarketBlurbs: jest.fn(({ text }) => <market-blurbs>{text}</market-blurbs>),
}));

describe("ObbPlayersModal", () => {
  const onDismiss = jest.fn();
  const title = "Test Title";
  const participantInfo = "Test Participant Info";
  const children = <div>Test Children</div>;
  const teams = {
    home: { id: "homeTeam", name: "Home Team" },
    away: { id: "awayTeam", name: "Away Team" },
  };
  const selectedTeamId = "homeTeam";
  const handleTeamChange = jest.fn();

  beforeEach(jest.clearAllMocks);

  it("should render Modal when isDesktopLayout is true", () => {
    useContext.mockReturnValue({ isDesktopLayout: true });

    render(
      <ObbPlayersModal
        onDismiss={onDismiss}
        title={title}
        participantInfo={participantInfo}
        teams={teams}
        selectedTeamId={selectedTeamId}
        handleTeamChange={handleTeamChange}
      >
        {children}
      </ObbPlayersModal>,
    );

    expect(Modal).toHaveBeenCalled();
    expect(SegmentedControl).toHaveBeenCalled();
    expect(MarketBlurbs).toHaveBeenCalled();
  });

  it("should render BottomSheet when isDesktopLayout is false", () => {
    useContext.mockReturnValue({ isDesktopLayout: false });

    render(
      <ObbPlayersModal
        onDismiss={onDismiss}
        title={title}
        participantInfo={participantInfo}
        teams={teams}
        selectedTeamId={selectedTeamId}
        handleTeamChange={handleTeamChange}
      >
        {children}
      </ObbPlayersModal>,
    );

    expect(BottomSheet).toHaveBeenCalled();
  });
});
