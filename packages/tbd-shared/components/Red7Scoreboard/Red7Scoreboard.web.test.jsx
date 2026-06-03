import "jest-dom/extend-expect";
import { render } from "@testing-library/react";

import Red7Scoreboard from "./Red7Scoreboard.web";

describe("Red7Scoreboard - Web", () => {
  const defaultProps = {
    red7Scoreboard: {
      fullURL: "https://fullred7iframeURL.com",
      origin: "https://originURL.com",
    },
    setShowRed7Scoreboard: jest.fn(),
  };

  it("renders the component with a valid iframe URL", () => {
    const { getByTitle } = render(<Red7Scoreboard {...defaultProps} />);
    const iframe = getByTitle("red7");

    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "https://fullred7iframeURL.com");
  });

  it("ignores messages from untrusted origins", () => {
    render(<Red7Scoreboard {...defaultProps} />);

    const badOrigin = new MessageEvent("message", {
      origin: "https://untrusted.com",
      data: { data: { status: "error", message: "Invalid Event" } },
    });

    const goodOrigin = new MessageEvent("message", {
      origin: "https://originURL.com",
      data: { data: { status: "error", message: "Invalid Event" } },
    });

    window.dispatchEvent(badOrigin);
    expect(defaultProps.setShowRed7Scoreboard).not.toHaveBeenCalled();

    window.dispatchEvent(goodOrigin);
    expect(defaultProps.setShowRed7Scoreboard).toHaveBeenCalled();
  });

  it("adjusts iframe height on heightChange message", () => {
    const { getByTitle } = render(<Red7Scoreboard {...defaultProps} />);
    const iframe = getByTitle("red7");

    const event = new MessageEvent("message", {
      origin: "https://originURL.com",
      data: { type: "heightChange", data: { height: 500 } },
    });

    window.dispatchEvent(event);
    expect(iframe.style.height).toBe("500px");
  });

  it("calls setShowRed7Scoreboard(false) on Invalid Event error", () => {
    render(<Red7Scoreboard {...defaultProps} />);

    const event = new MessageEvent("message", {
      origin: "https://originURL.com",
      data: { type: "error", data: { status: "error", message: "Invalid Event" } },
    });

    window.dispatchEvent(event);
    expect(defaultProps.setShowRed7Scoreboard).toHaveBeenCalledWith(false);
  });

  it("calls setShowRed7Scoreboard(false) when event is pre-live", () => {
    render(<Red7Scoreboard {...defaultProps} />);

    const event = new MessageEvent("message", {
      origin: "https://originURL.com",
      data: { type: "error", data: { status: "success", message: "pre" } },
    });

    window.dispatchEvent(event);
    expect(defaultProps.setShowRed7Scoreboard).toHaveBeenCalledWith(false);
  });

  it("calls setShowRed7Scoreboard(false) when red7 data is undefined", () => {
    render(<Red7Scoreboard {...defaultProps} />);

    const event = new MessageEvent("message", {
      origin: "https://originURL.com",
      data: { type: "error" },
    });

    window.dispatchEvent(event);
    expect(defaultProps.setShowRed7Scoreboard).toHaveBeenCalledWith(false);
  });

  it("calls setShowRed7Scoreboard(false) when red7 data is null", () => {
    render(<Red7Scoreboard {...defaultProps} />);

    const event = new MessageEvent("message", {
      origin: "https://originURL.com",
      data: { type: "error", data: null },
    });

    window.dispatchEvent(event);
    expect(defaultProps.setShowRed7Scoreboard).toHaveBeenCalledWith(false);
  });

  it("removes the message event listener on unmount", () => {
    const { unmount } = render(<Red7Scoreboard {...defaultProps} />);
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("message", expect.any(Function));
  });
});
