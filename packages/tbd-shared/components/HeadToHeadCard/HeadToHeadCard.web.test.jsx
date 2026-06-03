import "jest-dom/extend-expect";
import { render } from "@testing-library/react";

import { HeadToHeadDetailed } from "./snowflakes/HeadToHeadDetailed/HeadToHeadDetailed.web";
import { TEST_ID } from "./HeadToHeadCard.web.selectors";
import HeadtoHeadCard from "./HeadToHeadCard.web";

jest.mock("./snowflakes/HeadToHeadDetailed/HeadToHeadDetailed.web", () => ({
  HeadToHeadDetailed: jest.fn(() => <head-to-head-detailed-mock />),
}));

const renderHeadToHeadCard = (props) => render(<HeadtoHeadCard {...props} />);

describe("HeadToHeadCard - WEB", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("when there are no headToHeadProps", () => {
    it("should not render anything if there are no headToHeadProps", () => {
      const component = renderHeadToHeadCard({});

      expect(component.container.querySelector(TEST_ID)).toBeNull();
      expect(HeadToHeadDetailed).not.toHaveBeenCalled();
    });
  });

  describe("when there are headToHeadProps", () => {
    it("should call HeadToHeadDetailed with the correct props", () => {
      const FIRST_HEAD_TO_HEAD = "FIRST_HEAD_TO_HEAD";
      const SECOND_HEAD_TO_HEAD = "SECOND_HEAD_TO_HEAD";
      const THIRD_HEAD_TO_HEAD = "THIRD_HEAD_TO_HEAD";
      const HEAD_TO_HEAD_PROPS = [FIRST_HEAD_TO_HEAD, SECOND_HEAD_TO_HEAD, THIRD_HEAD_TO_HEAD];
      const CAPTION_TRANSLATIONS = "CAPTION_TRANSLATIONS";
      const COMPONENT_PROPS = {
        headToHeadProps: HEAD_TO_HEAD_PROPS,
        captionTranslations: CAPTION_TRANSLATIONS,
      };

      renderHeadToHeadCard(COMPONENT_PROPS);

      expect(HeadToHeadDetailed).toHaveBeenCalledWith(
        {
          headToHeadDetailedProps: HEAD_TO_HEAD_PROPS,
          captionI18n: CAPTION_TRANSLATIONS,
        },
        undefined,
      );
    });
  });
});
