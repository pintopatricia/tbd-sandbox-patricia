import { render } from "@testing-library/react-native";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { TEAM, NAME } from "@ppb/the-wall-native/components/Scoreboard/Team/Team.selectors";
import { VirtualTeam } from "./VirtualTeam.native";
import { virtualTeamStyles } from "./VirtualTeam.native.styles";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    TeamMediumPadding: {},
    TeamMediumHorizontalGapPrimary: {},
    TeamMediumLabelTypography: {},
    TeamTextLabelColour: {},
    TeamMediumCrestSizing: {},
    TeamTextSupportingTextColour: {},
    TeamMediumSupportingTextTypography: {},
    TeamServingIndicatorWidthSizing: {},
    TeamServingIndicatorHeightSizing: {},
    TeamServingIndicatorLeftBorderRadius: {
      borderBottomLeftRadius: {},
      borderBottomRightRadius: {},
      borderTopRightRadius: {},
      borderTopLeftRadius: {},
    },
    TeamServingIndicatorRightBorderRadius: {
      borderBottomLeftRadius: {},
      borderBottomRightRadius: {},
      borderTopRightRadius: {},
      borderTopLeftRadius: {},
    },
    TeamServingIndicatorInPlayBackgroundColour: {},
    TeamServingIndicatorPausedBackgroundColour: {},
    TeamSmallPadding: {},
    TeamSmallHorizontalGapPrimary: {},
    TeamSmallCrestSizing: {},
    TeamSmallLabelTypography: {},
    TeamSmallSupportingTextTypography: {},
  },
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const PROPS = {
  team: {
    name: "United",
  },
};

function renderTeam(props = PROPS) {
  return render(<VirtualTeam {...props} />);
}

describe("Team", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the Team container", () => {
    const { queryByTestId } = renderTeam();
    const teamContainer = queryByTestId(TEAM);

    expect(teamContainer).not.toBeNull();
  });

  it("should render the Team container with the correct styling", () => {
    const { queryByTestId } = renderTeam({
      ...PROPS,
      viewMode: ScoreboardViewMode.DEFAULT,
      football: true,
      reverseOrder: true,
    });
    const teamContainer = queryByTestId(TEAM);

    expect(teamContainer.props.style).toEqual([virtualTeamStyles.team, virtualTeamStyles.reverseOrder]);
  });

  it("should render the team name with the correct styling", () => {
    const { queryByTestId } = renderTeam({
      ...PROPS,
      viewMode: ScoreboardViewMode.DEFAULT,
      football: true,
    });
    const nameLabel = queryByTestId(NAME);

    expect(nameLabel).not.toBeNull();
    expect(nameLabel.props.style).toEqual([virtualTeamStyles.teamName]);
  });
  describe("when virtualTeam's name has more than one word", () => {
    it("should render text with numberOfLines equal to 2", () => {
      const { queryByTestId } = renderTeam({ team: { name: "man utd" } });
      const nameLabel = queryByTestId(NAME);

      expect(nameLabel).not.toBeNull();
      expect(nameLabel.props).toEqual(
        expect.objectContaining({
          numberOfLines: 2,
        }),
      );
    });
  });
  describe("when virtualTeam's name only one word", () => {
    it("should render text with numberOfLines equal to 1", () => {
      const { queryByTestId } = renderTeam({
        ...PROPS,
      });
      const nameLabel = queryByTestId(NAME);

      expect(nameLabel).not.toBeNull();
      expect(nameLabel.props).toEqual(
        expect.objectContaining({
          numberOfLines: 1,
        }),
      );
    });
  });
});
