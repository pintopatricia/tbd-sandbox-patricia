import "jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import BrowseSwitchExperience from "./BrowseSwitchExperience.web";

jest.mock("../BrowsePage", () => jest.fn(() => <div>connected-browse-mock</div>));
jest.mock("../GenericView", () => jest.fn(() => <div>connected-generic-mock</div>));

const urn = "urn:browse:sports";
describe("Browse component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should return browse page when throttle not present", async () => {
      render(<BrowseSwitchExperience urn={urn} />);
      expect(await screen.findByText("connected-browse-mock")).toBeInTheDocument();
    });

    it("should return browse page when throttle false", async () => {
      render(<BrowseSwitchExperience urn={urn} browsePagePrismic={false} />);
      expect(await screen.findByText("connected-browse-mock")).toBeInTheDocument();
    });

    it("should return generic view when throttle on", async () => {
      render(<BrowseSwitchExperience urn={urn} browsePagePrismic />);
      expect(await screen.findByText("connected-generic-mock")).toBeInTheDocument();
    });
  });
});
