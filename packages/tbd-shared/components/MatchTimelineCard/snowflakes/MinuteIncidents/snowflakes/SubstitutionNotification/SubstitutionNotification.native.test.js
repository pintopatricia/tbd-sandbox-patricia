import { render } from "@testing-library/react-native";
import { FixtureTeamSide, IncidentIconType } from "@ppb/the-wall-common/types";
import { IncidentIcon } from "@ppb/the-wall-native";
import { SubstitutionNotification } from "./SubstitutionNotification.native";
import styles from "./SubstitutionNotification.native.styles";
import {
  SUBSTITUTION_NOTIFICATION,
  SUBSTITUTION_NOTIFICATION_TITLE,
  SUBSTITUTION_NOTIFICATION_PLAYER_IN_ENTRY,
  SUBSTITUTION_NOTIFICATION_PLAYER_IN_ICON,
  SUBSTITUTION_NOTIFICATION_PLAYER_IN_TEXT,
  SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ENTRY,
  SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ICON,
  SUBSTITUTION_NOTIFICATION_PLAYER_OUT_TEXT,
} from "./SubstitutionNotification.native.selectors";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  IncidentIcon: jest.fn(() => <incident-icon-mock />),
  Text: jest.requireActual("react-native").Text,
}));

function renderSubstitutionNotification({ title, playerIn, playerOut, side }) {
  const selectors = render(
    <SubstitutionNotification title={title} playerIn={playerIn} playerOut={playerOut} side={side} />,
  );
  const { queryByTestId } = selectors;

  return {
    substitutionNotification: queryByTestId(SUBSTITUTION_NOTIFICATION),
    title: queryByTestId(SUBSTITUTION_NOTIFICATION_TITLE),
    playerInEntry: queryByTestId(SUBSTITUTION_NOTIFICATION_PLAYER_IN_ENTRY),
    playerInIcon: queryByTestId(SUBSTITUTION_NOTIFICATION_PLAYER_IN_ICON),
    playerInText: queryByTestId(SUBSTITUTION_NOTIFICATION_PLAYER_IN_TEXT),
    playerOutEntry: queryByTestId(SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ENTRY),
    playerOutIcon: queryByTestId(SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ICON),
    playerOutText: queryByTestId(SUBSTITUTION_NOTIFICATION_PLAYER_OUT_TEXT),
  };
}

beforeEach(jest.clearAllMocks);

describe("SubstitutionNotification", () => {
  const awaySetupValues = {
    title: "TITLE",
    playerIn: "PLAYER_IN",
    playerOut: "PLAYER_OUT",
    side: FixtureTeamSide.AWAY,
  };
  const homeSetupValues = { ...awaySetupValues, side: FixtureTeamSide.HOME };

  afterEach(jest.clearAllMocks);

  describe("substitution notification container", () => {
    it("should render the substitution notification container with the correct styling", () => {
      const { substitutionNotification } = renderSubstitutionNotification(awaySetupValues);
      expect(substitutionNotification).toHaveStyle(styles.notification);
    });
  });

  describe("substitution title", () => {
    describe("and side is FixtureTeamSide.AWAY", () => {
      it("should render the title with the correct stylinng and content", () => {
        const { title } = renderSubstitutionNotification(awaySetupValues);
        expect(title).toHaveStyle(styles.title);
        expect(title).toHaveTextContent(awaySetupValues.title);
      });
    });

    describe("and side is FixtureTeamSide.HOME", () => {
      it("should render the title with the correct stylinng and content", () => {
        const { title } = renderSubstitutionNotification(homeSetupValues);
        expect(title).toHaveStyle([styles.title, styles.homeText]);
        expect(title).toHaveTextContent(awaySetupValues.title);
      });
    });
  });

  describe("player in", () => {
    describe("and playerIn is not defined", () => {
      it("should not render the player in entry", () => {
        const { playerInEntry } = renderSubstitutionNotification({
          ...awaySetupValues,
          playerIn: undefined,
        });
        expect(playerInEntry).toBe(null);
      });
    });

    describe("and playerIn is defined", () => {
      it("should render the player in icon container with the correct styling", () => {
        const { playerInIcon } = renderSubstitutionNotification(awaySetupValues);
        expect(playerInIcon).toHaveStyle(styles.icon);
      });

      it("should call the In icon with the correct parameters", () => {
        renderSubstitutionNotification(awaySetupValues);
        expect(IncidentIcon.mock.calls[0][0]).toEqual({ type: IncidentIconType.SUBSTITUTION_IN });
      });

      describe("and side is FixtureTeamSide.AWAY", () => {
        it("should render the player in entry with the correct styling", () => {
          const { playerInEntry } = renderSubstitutionNotification(awaySetupValues);
          expect(playerInEntry).toHaveStyle(styles.entry);
        });

        it("should render the player in text with the correct styling and content", () => {
          const { playerInText } = renderSubstitutionNotification(awaySetupValues);
          expect(playerInText).toHaveStyle(styles.substitutionText);
          expect(playerInText).toHaveTextContent(awaySetupValues.playerIn);
        });
      });

      describe("and side is FixtureTeamSide.HOME", () => {
        it("should render the player in entry with the correct styling", () => {
          const { playerInEntry } = renderSubstitutionNotification(homeSetupValues);
          expect(playerInEntry).toHaveStyle([styles.entry, styles.entryHome]);
        });

        it("should render the player in text with the correct styling and content", () => {
          const { playerInText } = renderSubstitutionNotification(homeSetupValues);
          expect(playerInText).toHaveStyle([styles.substitutionText, styles.homeText]);
          expect(playerInText).toHaveTextContent(homeSetupValues.playerIn);
        });
      });
    });
  });

  describe("player out", () => {
    describe("and playerOut is not defined", () => {
      it("should not render the player out entry", () => {
        const { playerOutEntry } = renderSubstitutionNotification({
          ...awaySetupValues,
          playerOut: undefined,
        });
        expect(playerOutEntry).toBe(null);
      });
    });

    describe("and playerOut is defined", () => {
      it("should render the player out icon container with the correct styling", () => {
        const { playerOutIcon } = renderSubstitutionNotification(awaySetupValues);
        expect(playerOutIcon).toHaveStyle(styles.icon);
      });

      it("should call the Out icon with the correct parameters", () => {
        renderSubstitutionNotification(awaySetupValues);
        expect(IncidentIcon.mock.calls[1][0]).toEqual({ type: IncidentIconType.SUBSTITUTION_OUT });
      });

      describe("and side is FixtureTeamSide.AWAY", () => {
        it("should render the player out entry with the correct styling", () => {
          const { playerInEntry } = renderSubstitutionNotification(awaySetupValues);
          expect(playerInEntry).toHaveStyle(styles.entry);
        });

        it("should render the player out text with the correct styling and content", () => {
          const { playerOutText } = renderSubstitutionNotification(awaySetupValues);
          expect(playerOutText).toHaveStyle(styles.substitutionText);
          expect(playerOutText).toHaveTextContent(awaySetupValues.playerOut);
        });
      });

      describe("and side is FixtureTeamSide.HOME", () => {
        it("should render the player out entry with the correct styling", () => {
          const { playerOutEntry } = renderSubstitutionNotification(homeSetupValues);
          expect(playerOutEntry).toHaveStyle([styles.entry, styles.entryHome]);
        });

        it("should render the player out text with the correct styling and content", () => {
          const { playerOutText } = renderSubstitutionNotification(homeSetupValues);
          expect(playerOutText).toHaveStyle([styles.substitutionText, styles.homeText]);
          expect(playerOutText).toHaveTextContent(homeSetupValues.playerOut);
        });
      });
    });
  });
});
