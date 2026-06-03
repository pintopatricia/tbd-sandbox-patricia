import { render } from "@testing-library/react-native";
import { ValueIconName } from "@ppb/the-wall-icons";

import { Collapse } from "@ppb/the-wall-native/components/Collapse/Collapse";
import { BetSelectionDetails } from "@ppb/the-wall-native/components/BetDetails/BetSelectionDetails/BetSelectionDetails";
import { BET_SELECTIONS } from "./BetSelections.native.selectors";
import { BetSelections } from "./BetSelections.native";

jest.mock("@ppb/the-wall-native/components/Collapse/Collapse", () => ({
  Collapse: jest.fn(() => <collapse-mock />),
}));

jest.mock("@ppb/the-wall-native/components/BetDetails/BetSelectionDetails/BetSelectionDetails", () => ({
  BetSelectionDetails: jest.fn((props) => <sbk-multiples-selections>{props.silk}</sbk-multiples-selections>),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const SPORTSBOOK_MULTIPLES_SELECTIONS = [
  {
    id: "selection-id-1",
    urn: "selection-urn-1",
    title: "Yadanarbon",
    action: "Yadanarbon Action",
    subtitle: "Match Odds - Yadanarbon v Ispe FC",
    silk: "silkUrl1",
    silkFallbackType: "silkFallbackType1",
    odd: "1.53",
    oddsMovement: "up",
    is90Min: true,
    notificationsUnavailable: false,
  },
  {
    id: "selection-id-2",
    urn: "selection-urn-2",
    title: "Ayeyawady United",
    action: "Ayeyawady United Action",
    subtitle: "Match Odds - Ayeyawady United v Rakhine Utd",
    silk: "silkUrl2",
    silkFallbackType: "silkFallbackType2",
    odd: "1.47",
    notificationsUnavailable: false,
  },
];

const SPORTSBOOK_UNAVAILABLE_NOTIFICATIONS_MULTIPLES_SELECTIONS = [
  {
    id: "selection-id-1",
    title: "Yadanarbon",
    action: "Yadanarbon Action",
    subtitle: "Match Odds - Yadanarbon v Ispe FC",
    odd: "1.53",
    oddsMovement: "up",
    is90Min: true,
    isPushNotificationsUnavailable: true,
  },
  {
    id: "selection-id-2",
    title: "Ayeyawady United",
    action: "Ayeyawady United Action",
    subtitle: "Match Odds - Ayeyawady United v Rakhine Utd",
    odd: "1.47",
    isPushNotificationsUnavailable: true,
  },
];

function renderBetSelections({
  title = "I18N.BETSLIP.SELECTIONS",
  selections = SPORTSBOOK_MULTIPLES_SELECTIONS,
  icon,
  onTitleClick,
  onSelectionRemove,
  hasBorderRadius,
} = {}) {
  return render(
    <BetSelections
      title={title}
      selections={selections}
      icon={icon}
      onTitleClick={onTitleClick}
      onSelectionRemove={onSelectionRemove}
      hasBorderRadius={hasBorderRadius}
    />,
  );
}

describe("SportsbookMultipleComposition", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render", () => {
    const { getByTestId } = renderBetSelections({});
    const container = getByTestId(BET_SELECTIONS);
    expect(container).toBeDefined();
  });

  describe("Collapse", () => {
    it("should be called with expected props", () => {
      const onTitleClick = jest.fn();
      renderBetSelections({ title: "I18N.BETSLIP.SELECTIONS", onTitleClick });

      expect(Collapse).toHaveBeenCalledWith(
        expect.objectContaining({
          onTitleClick,
          isOpen: true,
          setIsOpen: expect.any(Function),
          header: expect.any(Object),
          children: expect.any(Object),
        }),
        undefined,
      );
      expect(Collapse.mock.calls[0][0].header.props).toMatchObject({
        isOpen: true,
        title: "I18N.BETSLIP.SELECTIONS",
      });
      expect(Collapse).toHaveBeenCalledTimes(1);
    });

    describe("when there are children", () => {
      describe("when icon is defined in selections", () => {
        it("should call BetSelectionDetails with the icon for the selection", () => {
          const mockIcon = <div>Mock Icon</div>;

          renderBetSelections({
            onSelectionRemove: jest.fn(),
            selections: [
              { ...SPORTSBOOK_MULTIPLES_SELECTIONS[0], icon: mockIcon },
              { ...SPORTSBOOK_MULTIPLES_SELECTIONS[1], icon: mockIcon },
            ],
          });
          render(Collapse.mock.calls[0][0].children);

          expect(BetSelectionDetails).toHaveBeenNthCalledWith(
            1,
            {
              title: "Yadanarbon",
              subtitle: "Match Odds - Yadanarbon v Ispe FC",
              icon: mockIcon,
              odd: "1.53",
              oddsMovement: "up",
              onSelectionRemove: expect.any(Function),
              hintMessage: undefined,
              hintType: undefined,
              is90Min: true,
              isPlacing: undefined,
              isPushNotificationsUnavailable: undefined,
            },
            undefined,
          );

          expect(BetSelectionDetails).toHaveBeenNthCalledWith(
            2,
            {
              title: "Ayeyawady United",
              subtitle: "Match Odds - Ayeyawady United v Rakhine Utd",
              icon: mockIcon,
              odd: "1.47",
              onSelectionRemove: expect.any(Function),
              hintMessage: undefined,
              hintType: undefined,
              is90Min: undefined,
              isPlacing: undefined,
              isPushNotificationsUnavailable: undefined,
            },
            undefined,
          );
          expect(BetSelectionDetails).toHaveBeenCalledTimes(2);
        });
      });

      describe("when icon is not defined in selections", () => {
        it("should call BetSelectionDetails with correct props", () => {
          renderBetSelections({
            onSelectionRemove: jest.fn(),
          });
          render(Collapse.mock.calls[0][0].children);

          expect(BetSelectionDetails).toHaveBeenNthCalledWith(
            1,
            {
              title: "Yadanarbon",
              subtitle: "Match Odds - Yadanarbon v Ispe FC",
              silk: undefined,
              odd: "1.53",
              oddsMovement: "up",
              onSelectionRemove: expect.any(Function),
              hintMessage: undefined,
              hintType: undefined,
              is90Min: true,
              isPlacing: undefined,
              isPushNotificationsUnavailable: undefined,
            },
            undefined,
          );

          expect(BetSelectionDetails).toHaveBeenNthCalledWith(
            2,
            {
              title: "Ayeyawady United",
              subtitle: "Match Odds - Ayeyawady United v Rakhine Utd",
              silk: undefined,
              odd: "1.47",
              onSelectionRemove: expect.any(Function),
              hintMessage: undefined,
              hintType: undefined,
              is90Min: undefined,
              isPlacing: undefined,
              isPushNotificationsUnavailable: undefined,
            },
            undefined,
          );
          expect(BetSelectionDetails).toHaveBeenCalledTimes(2);
        });
      });

      describe("when onSelectionRemove is passed", () => {
        it("should call BetSelectionDetails with correct props", () => {
          renderBetSelections({ onSelectionRemove: jest.fn() });
          render(Collapse.mock.calls[0][0].children);

          expect(BetSelectionDetails).toHaveBeenNthCalledWith(
            1,
            {
              title: "Yadanarbon",
              subtitle: "Match Odds - Yadanarbon v Ispe FC",
              silk: undefined,
              odd: "1.53",
              oddsMovement: "up",
              hintMessage: undefined,
              hintType: undefined,
              is90Min: true,
              onSelectionRemove: expect.any(Function),
            },
            undefined,
          );
          expect(BetSelectionDetails).toHaveBeenNthCalledWith(
            2,
            {
              title: "Ayeyawady United",
              subtitle: "Match Odds - Ayeyawady United v Rakhine Utd",
              silk: undefined,
              odd: "1.47",
              hintMessage: undefined,
              hintType: undefined,
              onSelectionRemove: expect.any(Function),
            },
            undefined,
          );
          expect(BetSelectionDetails).toHaveBeenCalledTimes(2);
        });

        describe("when onSelectionRemove is called", () => {
          it("should call the onSelectionRemove function", () => {
            const mockOnSelectionRemove = jest.fn();
            renderBetSelections({ onSelectionRemove: mockOnSelectionRemove });
            render(Collapse.mock.calls[0][0].children);

            BetSelectionDetails.mock.calls[0][0].onSelectionRemove();

            expect(mockOnSelectionRemove).toHaveBeenCalledWith("selection-id-1", "selection-urn-1");
          });
        });
      });

      describe("when onSelectionRemove is not passed", () => {
        it("should pass BetSelectionDetails without onSelectionRemove", () => {
          renderBetSelections({});
          render(Collapse.mock.calls[0][0].children);

          expect(BetSelectionDetails).toHaveBeenNthCalledWith(
            1,
            {
              title: "Yadanarbon",
              subtitle: "Match Odds - Yadanarbon v Ispe FC",
              silk: undefined,
              odd: "1.53",
              oddsMovement: "up",
              hintMessage: undefined,
              hintType: undefined,
              is90Min: true,
            },
            undefined,
          );
          expect(BetSelectionDetails).toHaveBeenNthCalledWith(
            2,
            {
              title: "Ayeyawady United",
              subtitle: "Match Odds - Ayeyawady United v Rakhine Utd",
              silk: undefined,
              odd: "1.47",
              hintMessage: undefined,
              hintType: undefined,
            },
            undefined,
          );
          expect(BetSelectionDetails).toHaveBeenCalledTimes(2);
        });
      });

      describe("when Selection Type Icon is passed", () => {
        it("should call BetSelectionDetails with Selection Type Icon", () => {
          renderBetSelections({
            selections: [
              { ...SPORTSBOOK_MULTIPLES_SELECTIONS[0], selectionTypeIcon: ValueIconName.SPORTS_PROMOTION },
              { ...SPORTSBOOK_MULTIPLES_SELECTIONS[1], selectionTypeIcon: ValueIconName.SPORTS_PROMOTION },
            ],
          });
          render(Collapse.mock.calls[0][0].children);

          expect(BetSelectionDetails).toHaveBeenCalledWith(
            expect.objectContaining({
              selectionTypeIcon: ValueIconName.SPORTS_PROMOTION,
            }),
            undefined,
          );
        });
      });

      describe("when Selection Type Icon is not passed", () => {
        it("should call BetSelectionDetails with Selection Type Icon as undefined", () => {
          renderBetSelections({});
          render(Collapse.mock.calls[0][0].children);

          expect(BetSelectionDetails).toHaveBeenCalledWith(
            expect.objectContaining({
              selectionTypeIcon: undefined,
            }),
            undefined,
          );
        });
      });
    });
  });

  describe("when selections have a truthy isPushNotificationsUnavailable", () => {
    beforeEach(() => jest.clearAllMocks());

    it("should call with a truthy isPushNotificationsUnavailable", () => {
      renderBetSelections({ selections: SPORTSBOOK_UNAVAILABLE_NOTIFICATIONS_MULTIPLES_SELECTIONS });
      render(Collapse.mock.calls[0][0].children);

      expect(BetSelectionDetails).toHaveBeenNthCalledWith(
        1,
        {
          title: "Yadanarbon",
          subtitle: "Match Odds - Yadanarbon v Ispe FC",
          odd: "1.53",
          oddsMovement: "up",
          hintMessage: undefined,
          hintType: undefined,
          is90Min: true,
          isPushNotificationsUnavailable: true,
        },
        undefined,
      );
      expect(BetSelectionDetails).toHaveBeenNthCalledWith(
        2,
        {
          title: "Ayeyawady United",
          subtitle: "Match Odds - Ayeyawady United v Rakhine Utd",
          odd: "1.47",
          hintMessage: undefined,
          hintType: undefined,
          isPushNotificationsUnavailable: true,
        },
        undefined,
      );
      expect(BetSelectionDetails).toHaveBeenCalledTimes(2);
    });
  });
});
