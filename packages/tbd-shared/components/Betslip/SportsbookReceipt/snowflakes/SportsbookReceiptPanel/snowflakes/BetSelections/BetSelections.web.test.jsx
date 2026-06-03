import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ValueIconName } from "@ppb/the-wall-icons";

import { Collapse } from "@ppb/the-wall-web/components/bricks/Collapse/Collapse";
import { SilkWrapper } from "@ppb/the-wall-web/components/bricks/SilkWrapper/SilkWrapper";
import { BetSelectionDetails } from "@ppb/the-wall-web/components/walls/BetSelectionDetails/BetSelectionDetails";
import { BetSelections } from "./BetSelections.web";
import { TEST_ID } from "./BetSelections.web.selectors";

jest.mock("@ppb/the-wall-web/components/bricks/Collapse/Collapse", () => ({
  Collapse: jest.fn(() => <collapse-mock />),
}));

jest.mock("@ppb/the-wall-web/components/walls/BetSelectionDetails/BetSelectionDetails", () => ({
  BetSelectionDetails: jest.fn((props) => <bet-selection-details-mock>{props.silk}</bet-selection-details-mock>),
}));

jest.mock("@ppb/the-wall-web/components/bricks/SilkWrapper/SilkWrapper", () => ({
  SilkWrapper: jest.fn(() => <silk-wrapper-mock />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
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
  },
];

function renderBetSelections({
  title = "I18N.BETSLIP.SELECTIONS",
  selections = SPORTSBOOK_MULTIPLES_SELECTIONS,
  icon,
  onTitleClick,
  onSelectionRemove,
  hasBorderRadius,
}) {
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

describe("BetSelections", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render", () => {
    const { container } = renderBetSelections({});

    expect(container.querySelector(TEST_ID)).not.toBeNull();
  });

  describe("Collapse", () => {
    it("should be called", () => {
      const onTitleClick = jest.fn();
      renderBetSelections({ onTitleClick });

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
      expect(Collapse).toHaveBeenCalledTimes(1);
    });

    it("should pass title to header", () => {
      renderBetSelections({});

      const { queryByText } = render(Collapse.mock.calls[0][0].header);

      expect(queryByText("I18N.BETSLIP.SELECTIONS")).not.toBeNull();
    });

    describe("when there are children", () => {
      describe("when icon is defined in selection", () => {
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

          expect(SilkWrapper).toHaveBeenCalledTimes(0);

          expect(BetSelectionDetails).toHaveBeenNthCalledWith(
            1,
            {
              title: "Yadanarbon",
              subtitle: "Match Odds - Yadanarbon v Ispe FC",
              silk: undefined,
              odd: "1.53",
              oddsMovement: "up",
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
              onSelectionRemove: expect.any(Function),
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
});
