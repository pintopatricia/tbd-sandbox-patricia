import { render } from "@testing-library/react-native";

import { FixtureTeamSide } from "@ppb/the-wall-common/types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { colors } from "@ppb/the-wall-common/base-theme";
import { SportsIconName } from "@ppb/the-wall-icons";

import { GoalNotification } from "./GoalNotification.native";
import {
  GOAL_NOTIFICATION,
  GOAL_NOTIFICATION_TITLE,
  GOAL_NOTIFICATION_DESCRIPTION,
  GOAL_NOTIFICATION_SECOND_DESCRIPTION,
} from "./GoalNotification.native.selectors";
import styles from "./GoalNotification.native.styles";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderGoalNotification({ title, description, secondDescription, side, isOwnGoal }) {
  return render(
    <GoalNotification
      title={title}
      description={description}
      secondDescription={secondDescription}
      side={side}
      isOwnGoal={isOwnGoal}
    />,
  );
}

describe("Match Timeline - Goal Notification", () => {
  afterEach(jest.clearAllMocks);

  describe("initialization", () => {
    it("should render when all mandatory props are provided", () => {
      const { queryByTestId } = renderGoalNotification({
        title: "title",
        side: FixtureTeamSide.HOME,
        isOwnGoal: false,
      });

      expect(queryByTestId(GOAL_NOTIFICATION)).not.toBeNull();
      expect(queryByTestId(GOAL_NOTIFICATION_TITLE)).toHaveTextContent("title");
      expect(GenericIcon).toHaveBeenCalledWith(
        { color: colors.SignpostingIndicatorsRichContentIconWarning2, name: SportsIconName.FOOTBALL },
        undefined,
      );
    });
  });

  describe("Home side events", () => {
    describe("Goal", () => {
      let queryByTestId;
      beforeEach(() => {
        ({ queryByTestId } = renderGoalNotification({
          title: "title",
          description: "description",
          secondDescription: "secondDescription",
          side: FixtureTeamSide.HOME,
          isOwnGoal: false,
        }));
      });

      it("should render with the correct structure", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          { color: colors.SignpostingIndicatorsRichContentIconWarning2, name: SportsIconName.FOOTBALL },
          undefined,
        );
        expect(queryByTestId(GOAL_NOTIFICATION_TITLE)).toHaveTextContent("title");
        expect(queryByTestId(GOAL_NOTIFICATION_DESCRIPTION)).toHaveTextContent("description");
        expect(queryByTestId(GOAL_NOTIFICATION_SECOND_DESCRIPTION)).toHaveTextContent("secondDescription");
      });

      it("should have goal style for home team", () => {
        expect(queryByTestId(GOAL_NOTIFICATION)).toHaveStyle([styles.goalNotification, styles.goalHome, styles.goal]);
        expect(queryByTestId(GOAL_NOTIFICATION_TITLE)).toHaveStyle([
          styles.title,
          styles.textHome,
          styles.textGoalTitle,
        ]);
        expect(queryByTestId(GOAL_NOTIFICATION_DESCRIPTION)).toHaveStyle([
          styles.description,
          styles.textHome,
          styles.textGoalDescription,
        ]);
        expect(queryByTestId(GOAL_NOTIFICATION_SECOND_DESCRIPTION)).toHaveStyle([
          styles.description,
          styles.textHome,
          styles.textGoalDescription,
        ]);
      });
    });

    describe("OwnGoal", () => {
      let queryByTestId;
      beforeEach(() => {
        ({ queryByTestId } = renderGoalNotification({
          title: "title",
          description: "description",
          secondDescription: "secondDescription",
          side: FixtureTeamSide.HOME,
          isOwnGoal: true,
        }));
      });

      it("should render with the correct structure", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          { color: colors.SignpostingIndicatorsRichContentIconNegative2, name: SportsIconName.FOOTBALL },
          undefined,
        );
        expect(queryByTestId(GOAL_NOTIFICATION_TITLE)).toHaveTextContent("title");
        expect(queryByTestId(GOAL_NOTIFICATION_DESCRIPTION)).toHaveTextContent("description");
        expect(queryByTestId(GOAL_NOTIFICATION_SECOND_DESCRIPTION)).toHaveTextContent("secondDescription");
      });

      it("should have own goal style for home team", () => {
        expect(queryByTestId(GOAL_NOTIFICATION)).toHaveStyle([
          styles.goalNotification,
          styles.goalHome,
          styles.ownGoal,
        ]);
        expect(queryByTestId(GOAL_NOTIFICATION_TITLE)).toHaveStyle([styles.title, styles.textHome, styles.textOwnGoal]);
        expect(queryByTestId(GOAL_NOTIFICATION_DESCRIPTION)).toHaveStyle([
          styles.description,
          styles.textHome,
          styles.textOwnGoal,
        ]);
        expect(queryByTestId(GOAL_NOTIFICATION_SECOND_DESCRIPTION)).toHaveStyle([
          styles.description,
          styles.textHome,
          styles.textOwnGoal,
        ]);
      });
    });
  });

  describe("Away side events", () => {
    describe("Goal", () => {
      let queryByTestId;
      beforeEach(() => {
        ({ queryByTestId } = renderGoalNotification({
          title: "title",
          description: "description",
          secondDescription: "secondDescription",
          side: FixtureTeamSide.AWAY,
          isOwnGoal: false,
        }));
      });

      it("should render with the correct structure", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          { color: colors.SignpostingIndicatorsRichContentIconWarning2, name: SportsIconName.FOOTBALL },
          undefined,
        );
        expect(queryByTestId(GOAL_NOTIFICATION_TITLE)).toHaveTextContent("title");
        expect(queryByTestId(GOAL_NOTIFICATION_DESCRIPTION)).toHaveTextContent("description");
        expect(queryByTestId(GOAL_NOTIFICATION_SECOND_DESCRIPTION)).toHaveTextContent("secondDescription");
      });

      it("should have goal style for away team", () => {
        expect(queryByTestId(GOAL_NOTIFICATION)).toHaveStyle([styles.goalNotification, styles.goalAway, styles.goal]);
        expect(queryByTestId(GOAL_NOTIFICATION_TITLE)).toHaveStyle([styles.title, styles.textAway, styles.textGoal]);
        expect(queryByTestId(GOAL_NOTIFICATION_DESCRIPTION)).toHaveStyle([
          styles.description,
          styles.textAway,
          styles.textGoal,
        ]);
        expect(queryByTestId(GOAL_NOTIFICATION_SECOND_DESCRIPTION)).toHaveStyle([
          styles.description,
          styles.textAway,
          styles.textGoal,
        ]);
      });
    });

    describe("OwnGoal", () => {
      let queryByTestId;
      beforeEach(() => {
        ({ queryByTestId } = renderGoalNotification({
          title: "title",
          description: "description",
          secondDescription: "secondDescription",
          side: FixtureTeamSide.AWAY,
          isOwnGoal: true,
        }));
      });

      it("should render with the correct structure", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          { color: colors.SignpostingIndicatorsRichContentIconNegative2, name: SportsIconName.FOOTBALL },
          undefined,
        );
        expect(queryByTestId(GOAL_NOTIFICATION_TITLE)).toHaveTextContent("title");
        expect(queryByTestId(GOAL_NOTIFICATION_DESCRIPTION)).toHaveTextContent("description");
        expect(queryByTestId(GOAL_NOTIFICATION_SECOND_DESCRIPTION)).toHaveTextContent("secondDescription");
      });

      it("should have own goal style for away team", () => {
        expect(queryByTestId(GOAL_NOTIFICATION)).toHaveStyle([
          styles.goalNotification,
          styles.goalAway,
          styles.ownGoal,
        ]);
        expect(queryByTestId(GOAL_NOTIFICATION_TITLE)).toHaveStyle([styles.title, styles.textAway, styles.textOwnGoal]);
        expect(queryByTestId(GOAL_NOTIFICATION_DESCRIPTION)).toHaveStyle([
          styles.description,
          styles.textAway,
          styles.textOwnGoal,
        ]);
        expect(queryByTestId(GOAL_NOTIFICATION_SECOND_DESCRIPTION)).toHaveStyle([
          styles.description,
          styles.textAway,
          styles.textOwnGoal,
        ]);
      });
    });
  });
});
