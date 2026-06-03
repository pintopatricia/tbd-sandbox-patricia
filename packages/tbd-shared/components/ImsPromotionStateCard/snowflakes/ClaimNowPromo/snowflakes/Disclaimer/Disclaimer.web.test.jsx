import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import styles from "./Disclaimer.web.css";
import { Disclaimer } from "./Disclaimer.web";
import { TEST_ID, TITLE, LIST_TITLE, ITEM_ONE, ITEM_TWO, FOOTER } from "./Disclaimer.web.selectors";

function renderDisclaimer({
  value = "$25",
  i18n = {
    titleFirstPart: "title 1",
    titleSecondPart: "title 2",
    listTitle: "list title",
    listItemOne: "list item 1",
    listItemTwo: "list item 2",
    bottomText: "footer",
  },
}) {
  const { container } = render(<Disclaimer value={value} i18n={i18n} />);
  return container.querySelector(TEST_ID);
}

describe("Disclaimer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Render component", () => {
    it("should render with correct css class", () => {
      const disclaimer = renderDisclaimer({});
      expect(disclaimer).toHaveClass(styles.disclaimer);
    });
    it("should have the correct Title", () => {
      const disclaimer = renderDisclaimer({});
      const title = disclaimer.querySelector(TITLE);

      expect(title).toHaveTextContent("title 1 $25 title 2");
    });
    it("should have the correct list title", () => {
      const disclaimer = renderDisclaimer({});
      const listTitle = disclaimer.querySelector(LIST_TITLE);

      expect(listTitle).toHaveTextContent("list title");
    });
    it("should have the correct item one text", () => {
      const disclaimer = renderDisclaimer({});
      const itemOne = disclaimer.querySelector(ITEM_ONE);

      expect(itemOne).toHaveTextContent("list item 1");
    });
    it("should have the correct item two text", () => {
      const disclaimer = renderDisclaimer({});
      const itemTwo = disclaimer.querySelector(ITEM_TWO);

      expect(itemTwo).toHaveTextContent("list item 2");
    });
    it("should have the correct bottom text", () => {
      const disclaimer = renderDisclaimer({});
      const bottomText = disclaimer.querySelector(FOOTER);

      expect(bottomText).toHaveTextContent("footer");
    });
  });
});
